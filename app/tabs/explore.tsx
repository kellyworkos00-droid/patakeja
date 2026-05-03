import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Modal, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { router } from "expo-router";
import { BedDouble, Building2, Home, LayoutGrid, SlidersHorizontal } from "lucide-react-native";
import type { ComponentType } from "react";
import { colors } from "@/constants/colors";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { FloatingSearchBar } from "@/components/forms/FloatingSearchBar";
import { CategoryChip } from "@/components/ui/CategoryChip";
import { MapPreviewCard } from "@/components/map/MapPreviewCard";
import { SortDropdown } from "@/components/ui/SortDropdown";
import { ListingCard } from "@/components/cards/ListingCard";
import { exploreListings, ExploreListing } from "@/data/mockExploreListings";

type Category = "All" | "Bedsitters" | "1 Bedroom" | "2 Bedroom" | "3+ Bedroom" | "Houses" | "Apartments";
type SortOption = "Newest" | "Price: Low to High" | "Price: High to Low" | "Distance";

const categories: Category[] = ["All", "Bedsitters", "1 Bedroom", "2 Bedroom", "3+ Bedroom", "Houses", "Apartments"];
const budgetOptions = ["KES 15K-25K", "KES 25K-40K", "KES 40K+"];
const propertyTypeOptions: Array<"Bedsitters" | "Apartments" | "Houses"> = ["Bedsitters", "Apartments", "Houses"];

type LucideIcon = ComponentType<{ color: string; size: number; strokeWidth?: number }>;

const categoryIcons: Record<Category, LucideIcon> = {
  All: LayoutGrid,
  Bedsitters: Home,
  "1 Bedroom": BedDouble,
  "2 Bedroom": BedDouble,
  "3+ Bedroom": BedDouble,
  Houses: Home,
  Apartments: Building2,
};

const cardShadow = {
  shadowColor: "#0B1220",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.09,
  shadowRadius: 14,
  elevation: 6,
};

const filterBtnShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 5,
};

const parsePrice = (price: string) => Number(price.replace(/[^\d]/g, ""));
const parseDistance = (distance: string) => Number.parseFloat(distance.replace(" km away", ""));

function filterByCategory(listing: ExploreListing, category: Category) {
  if (category === "All") return true;
  if (category === "Bedsitters") return listing.propertyType === "Bedsitters";
  if (category === "Houses") return listing.propertyType === "Houses";
  if (category === "Apartments") return listing.propertyType === "Apartments";
  if (category === "1 Bedroom") return listing.bedrooms === 1;
  if (category === "2 Bedroom") return listing.bedrooms === 2;
  if (category === "3+ Bedroom") return listing.bedrooms >= 3;
  return true;
}

export default function ExploreScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Newest");
  const [showFilters, setShowFilters] = useState(false);

  const entrance = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 680,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  const visibleListings = useMemo(() => {
    const filtered = exploreListings.filter((listing) => filterByCategory(listing, activeCategory));
    return filtered.sort((a, b) => {
      if (sortBy === "Price: Low to High") return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === "Price: High to Low") return parsePrice(b.price) - parsePrice(a.price);
      if (sortBy === "Distance") return parseDistance(a.distance) - parseDistance(b.distance);
      return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime();
    });
  }, [activeCategory, sortBy]);

  const displayResultCount = activeCategory === "All" ? 256 : visibleListings.length;

  const sectionStyle = (order: number) => {
    const start = Math.min(order * 0.11, 0.85);
    const end = Math.min(start + 0.26, 1);
    return {
      opacity: entrance.interpolate({
        inputRange: [start, end],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
      transform: [
        {
          translateY: entrance.interpolate({
            inputRange: [start, end],
            outputRange: [18, 0],
            extrapolate: "clamp",
          }),
        },
      ],
    };
  };

  return (
    <ScreenContainer scroll={false} padded={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <Animated.ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 146 }}
      >
        <Animated.View
          style={[
            {
              paddingHorizontal: 20,
              paddingTop: 14,
              paddingBottom: 10,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
            sectionStyle(0),
          ]}
        >
          <View>
            <Text style={{ fontSize: 30, fontWeight: "800", color: colors.navy, letterSpacing: -0.5 }}>Explore</Text>
            <Text style={{ fontSize: 14, color: "#64748B", fontWeight: "500", marginTop: 2 }}>Find your perfect home</Text>
          </View>

          <Pressable
            onPress={() => setShowFilters(true)}
            style={[
              {
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#FFFFFF",
                alignItems: "center",
                justifyContent: "center",
              },
              filterBtnShadow,
            ]}
          >
            <SlidersHorizontal color={colors.navy} size={20} strokeWidth={2.2} />
            <View
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.primary,
              }}
            />
          </Pressable>
        </Animated.View>

        <Animated.View style={sectionStyle(1)}>
          <FloatingSearchBar onPress={() => router.push("/search")} onFilterPress={() => setShowFilters(true)} />
        </Animated.View>

        <Animated.View style={[{ marginTop: 2 }, sectionStyle(2)]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingTop: 12, paddingBottom: 8 }}
          >
            {categories.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                icon={categoryIcons[category]}
                active={activeCategory === category}
                onPress={() => setActiveCategory(category)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={[{ marginTop: 6, marginBottom: 16 }, sectionStyle(3)]}>
          <MapPreviewCard onOpenMap={() => router.push("/explore-map")} />
        </Animated.View>

        <Animated.View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginBottom: 14,
            },
            sectionStyle(4),
          ]}
        >
          <Text style={{ fontSize: 14, color: "#64748B", fontWeight: "600" }}>
            <Text style={{ color: colors.navy, fontWeight: "800" }}>{displayResultCount}</Text> homes found
          </Text>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </Animated.View>

        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {visibleListings.map((listing, index) => (
            <Animated.View key={listing.id} style={[cardShadow, sectionStyle(5 + index * 0.3)]}>
              <ListingCard listing={listing} variant="explore" />
            </Animated.View>
          ))}
        </View>
      </Animated.ScrollView>

      <Modal visible={showFilters} animationType="slide" transparent onRequestClose={() => setShowFilters(false)}>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(15,23,42,0.34)" }}>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 20,
              paddingTop: 14,
              paddingBottom: 28,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <View style={{ width: 50, height: 5, borderRadius: 3, backgroundColor: "#E2E8F0" }} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: "800", color: colors.navy }}>Filters</Text>
              <Pressable onPress={() => setShowFilters(false)}>
                <Text style={{ color: colors.primary, fontSize: 14, fontWeight: "800" }}>Done</Text>
              </Pressable>
            </View>

            <Text style={{ fontSize: 14, color: colors.navy, fontWeight: "700", marginBottom: 8 }}>Budget</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {budgetOptions.map((budget) => (
                <View key={budget} style={{ borderRadius: 16, paddingHorizontal: 12, paddingVertical: 9, backgroundColor: "#F1F5F9" }}>
                  <Text style={{ color: colors.navy, fontSize: 12, fontWeight: "700" }}>{budget}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 14, color: colors.navy, fontWeight: "700", marginBottom: 8 }}>Property Type</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
              {propertyTypeOptions.map((kind) => (
                <Pressable
                  key={kind}
                  onPress={() => setActiveCategory(kind as Category)}
                  style={{
                    borderRadius: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                    backgroundColor: activeCategory === kind ? "#DCFCE7" : "#F1F5F9",
                  }}
                >
                  <Text style={{ color: colors.navy, fontSize: 12, fontWeight: "700" }}>{kind}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={{ fontSize: 12, color: "#64748B" }}>Approximate locations only. Communication stays inside app via Secure Chat.</Text>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}
