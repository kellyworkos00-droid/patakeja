import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Modal, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { router } from "expo-router";
import { ShieldCheck, SlidersHorizontal, Sparkles } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
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

const cardShadow = {
  shadowColor: "#0B1220",
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.14,
  shadowRadius: 24,
  elevation: 10,
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
  const heroPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 820,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(heroPulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(heroPulse, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [entrance, heroPulse]);

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
    const start = order * 0.1;
    const end = start + 0.25;
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
            outputRange: [20, 0],
            extrapolate: "clamp",
          }),
        },
      ],
    };
  };

  const pulseScale = heroPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.16],
  });

  return (
    <ScreenContainer scroll={false} padded={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <Animated.ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 146 }}>
        <Animated.View style={[{ paddingHorizontal: 20, paddingTop: 10 }, sectionStyle(0)]}>
          <LinearGradient
            colors={["#0F172A", "#18273C", "#22324A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: 28, paddingHorizontal: 18, paddingTop: 18, paddingBottom: 16, overflow: "hidden" }}
          >
            <Animated.View
              style={{
                position: "absolute",
                right: -44,
                top: -40,
                width: 140,
                height: 140,
                borderRadius: 70,
                backgroundColor: "rgba(22,163,74,0.22)",
                transform: [{ scale: pulseScale }],
              }}
            />

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ maxWidth: "78%" }}>
                <Text style={{ fontSize: 34, fontWeight: "900", color: "#FFFFFF", letterSpacing: -0.6 }}>Explore</Text>
                <Text style={{ fontSize: 14, color: "#D6E3F2", marginTop: 3, lineHeight: 20 }}>
                  Curated, verified homes with safer in-app booking and secure chat.
                </Text>
              </View>

              <Pressable
                onPress={() => setShowFilters(true)}
                style={[
                  {
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: "rgba(255,255,255,0.96)",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  cardShadow,
                ]}
              >
                <SlidersHorizontal color={colors.navy} size={20} strokeWidth={2.3} />
                <View style={{ position: "absolute", top: 11, right: 11, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
              </Pressable>
            </View>

            <View
              style={{
                marginTop: 14,
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderRadius: 16,
                backgroundColor: "rgba(255,255,255,0.1)",
                paddingVertical: 9,
                paddingHorizontal: 10,
              }}
            >
              <ShieldCheck size={16} color="#86EFAC" />
              <Text style={{ color: "#EAF3FF", fontSize: 12, fontWeight: "700" }}>No phone numbers shared. Approximate location only.</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={[{ marginTop: 14 }, sectionStyle(1)]}>
          <FloatingSearchBar onPress={() => router.push("/search")} onFilterPress={() => setShowFilters(true)} />
        </Animated.View>

        <Animated.View style={[{ marginTop: 8 }, sectionStyle(2)]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingTop: 10, paddingBottom: 8 }}
          >
            {categories.map((category) => (
              <CategoryChip key={category} label={category} active={activeCategory === category} onPress={() => setActiveCategory(category)} />
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View style={[{ marginTop: 10, marginBottom: 18 }, sectionStyle(3)]}>
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
          <View>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#64748B" }}>
              <Text style={{ color: colors.navy, fontWeight: "900" }}>{displayResultCount}</Text> homes found
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
              <Sparkles size={14} color={colors.primary} />
              <Text style={{ fontSize: 12, color: "#475569", fontWeight: "700" }}>Premium picks near your preferred zones</Text>
            </View>
          </View>
          <SortDropdown value={sortBy} onChange={setSortBy} />
        </Animated.View>

        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {visibleListings.map((listing, index) => (
            <Animated.View key={listing.id} style={[cardShadow, sectionStyle(5 + index * 0.35)]}>
              <ListingCard listing={listing} variant="explore" />
            </Animated.View>
          ))}
        </View>
      </Animated.ScrollView>

      <Modal visible={showFilters} animationType="slide" transparent onRequestClose={() => setShowFilters(false)}>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(15,23,42,0.34)" }}>
          <View style={{ backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 28 }}>
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
