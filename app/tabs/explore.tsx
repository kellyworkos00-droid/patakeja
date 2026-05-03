import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  BedDouble,
  Building2,
  ChevronDown,
  Home,
  LayoutGrid,
  Search,
  SlidersHorizontal,
} from "lucide-react-native";
import type { ComponentType } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/colors";
import { MapPreviewCard } from "@/components/map/MapPreviewCard";
import { ListingCard } from "@/components/cards/ListingCard";
import { exploreListings, ExploreListing } from "@/data/mockExploreListings";

type Category = "All" | "Bedsitters" | "1 Bedroom" | "2 Bedroom" | "3+ Bedroom" | "Houses" | "Apartments";
type SortOption = "Newest" | "Price: Low to High" | "Price: High to Low" | "Distance";

const categories: Category[] = ["All", "Bedsitters", "1 Bedroom", "2 Bedroom", "3+ Bedroom", "Houses", "Apartments"];
const sortOptions: SortOption[] = ["Newest", "Price: Low to High", "Price: High to Low", "Distance"];
const budgetOptions = ["KES 15K–25K", "KES 25K–40K", "KES 40K+"];
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

const parsePrice = (p: string) => Number(p.replace(/[^\d]/g, ""));
const parseDistance = (d: string) => Number.parseFloat(d.replace(" km away", ""));

function filterByCategory(listing: ExploreListing, cat: Category) {
  if (cat === "All") return true;
  if (cat === "Bedsitters") return listing.propertyType === "Bedsitters";
  if (cat === "Houses") return listing.propertyType === "Houses";
  if (cat === "Apartments") return listing.propertyType === "Apartments";
  if (cat === "1 Bedroom") return listing.bedrooms === 1;
  if (cat === "2 Bedroom") return listing.bedrooms === 2;
  if (cat === "3+ Bedroom") return listing.bedrooms >= 3;
  return true;
}

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 5,
};

const cardShadow = {
  shadowColor: "#0B1220",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 9,
  elevation: 3,
};

// ─── Chip ──────────────────────────────────────────────────────────────────
function Chip({
  label,
  active,
  onPress,
  icon: Icon,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: LucideIcon;
}) {
  const color = active ? "#FFFFFF" : colors.navy;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: 38,
          borderRadius: 19,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 13,
          gap: 5,
          backgroundColor: active ? colors.navy : "#FFFFFF",
          borderWidth: active ? 0 : 1,
          borderColor: "#E8EDF3",
          transform: [{ scale: pressed ? 0.96 : 1 }],
        },
        !active ? shadow : undefined,
      ]}
    >
      {Icon ? <Icon color={color} size={13} strokeWidth={2} /> : null}
      <Text style={{ fontSize: 13, fontWeight: "700", color }}>{label}</Text>
    </Pressable>
  );
}

// ─── SortPill ──────────────────────────────────────────────────────────────
function SortPill({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (v: SortOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const pillShadow = {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 7,
  };
  return (
    <View style={{ position: "relative", zIndex: 10 }}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 3, opacity: pressed ? 0.7 : 1 })}
      >
        <Text style={{ fontSize: 13, color: "#64748B", fontWeight: "600" }}>
          Sort:{" "}
          <Text style={{ fontWeight: "800", color: colors.navy }}>{value}</Text>
        </Text>
        <ChevronDown color={colors.navy} size={14} strokeWidth={2.5} />
      </Pressable>
      {open ? (
        <View
          style={[
            {
              position: "absolute",
              right: 0,
              top: 30,
              backgroundColor: "#FFFFFF",
              borderRadius: 16,
              paddingVertical: 6,
              minWidth: 200,
              zIndex: 999,
            },
            pillShadow,
          ]}
        >
          {sortOptions.map((opt) => (
            <Pressable
              key={opt}
              onPress={() => { onChange(opt); setOpen(false); }}
              style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: value === opt ? colors.primary : colors.navy }}>{opt}</Text>
              {value === opt ? (
                <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.primary }} />
              ) : null}
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────
export default function ExploreScreen() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<SortOption>("Newest");
  const [showFilters, setShowFilters] = useState(false);

  // entrance animation
  const entrance = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  // scroll-driven floating search bar
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({ inputRange: [0, 70], outputRange: [1, 0], extrapolate: "clamp" });
  const headerTranslateY = scrollY.interpolate({ inputRange: [0, 80], outputRange: [0, -52], extrapolate: "clamp" });

  const floatOpacity = scrollY.interpolate({ inputRange: [30, 90], outputRange: [0, 1], extrapolate: "clamp" });
  const floatTranslateY = scrollY.interpolate({ inputRange: [30, 90], outputRange: [-16, 0], extrapolate: "clamp" });
  const floatScale = scrollY.interpolate({ inputRange: [30, 90], outputRange: [0.94, 1], extrapolate: "clamp" });

  const visibleListings = useMemo(() => {
    const filtered = exploreListings.filter((l) => filterByCategory(l, activeCategory));
    return filtered.sort((a, b) => {
      if (sortBy === "Price: Low to High") return parsePrice(a.price) - parsePrice(b.price);
      if (sortBy === "Price: High to Low") return parsePrice(b.price) - parsePrice(a.price);
      if (sortBy === "Distance") return parseDistance(a.distance) - parseDistance(b.distance);
      return new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime();
    });
  }, [activeCategory, sortBy]);

  const displayCount = activeCategory === "All" ? 256 : visibleListings.length;

  const s = (order: number) => {
    const st = Math.min(order * 0.1, 0.8);
    const en = Math.min(st + 0.25, 1);
    return {
      opacity: entrance.interpolate({ inputRange: [st, en], outputRange: [0, 1], extrapolate: "clamp" }),
      transform: [{ translateY: entrance.interpolate({ inputRange: [st, en], outputRange: [16, 0], extrapolate: "clamp" }) }],
    };
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F8FB" }} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F8FB" />

      {/* ── Floating search bar (appears on scroll) ─────────────────────── */}
      <Animated.View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 10,
          left: 14,
          right: 14,
          zIndex: 20,
          opacity: floatOpacity,
          transform: [{ translateY: floatTranslateY }, { scale: floatScale }],
        }}
      >
        <Pressable
          onPress={() => router.push("/search")}
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            height: 42,
            paddingLeft: 14,
            paddingRight: 8,
            gap: 8,
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.13,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          <Search size={16} color={colors.primary} strokeWidth={2.4} />
          <Text style={{ flex: 1, fontSize: 13, color: "#94A3B8", fontWeight: "600" }}>Search location, area or property...</Text>
          <Pressable
            onPress={() => setShowFilters(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
              backgroundColor: colors.navy,
              borderRadius: 15,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <SlidersHorizontal size={13} color="#fff" strokeWidth={2.2} />
            <Text style={{ fontSize: 12, fontWeight: "800", color: "#fff" }}>Filters</Text>
          </Pressable>
        </Pressable>
      </Animated.View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* ── Header ────────────────────────────────────────────────────── */}
        <Animated.View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginHorizontal: 16,
              marginTop: 8,
              marginBottom: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 22,
              backgroundColor: "#FFFFFF",
              opacity: headerOpacity,
              transform: [{ translateY: headerTranslateY }],
            },
            shadow,
          ]}
        >
          <View>
            <Text style={{ fontSize: 12, fontWeight: "700", color: "#64748B", letterSpacing: 0.3 }}>DISCOVER</Text>
            <Text style={{ fontSize: 27, fontWeight: "800", color: colors.navy, letterSpacing: -0.6, marginTop: 1 }}>Explore</Text>
            <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "500", marginTop: 2 }}>Find your perfect home</Text>
          </View>
          <Pressable
            onPress={() => setShowFilters(true)}
            style={[
              {
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#F8FAFC",
                alignItems: "center",
                justifyContent: "center",
              },
            ]}
          >
            <SlidersHorizontal color={colors.navy} size={18} strokeWidth={2.2} />
            <View
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.primary,
                borderWidth: 1.5,
                borderColor: "#FFFFFF",
              }}
            />
          </Pressable>
        </Animated.View>

        {/* ── Search bar (inline, fades out on scroll) ──────────────────── */}
        <Animated.View style={[{ paddingHorizontal: 16, marginBottom: 10 }, s(0)]}>
          <Pressable
            onPress={() => router.push("/search")}
            style={[
              {
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: "#FFFFFF",
                borderRadius: 18,
                borderWidth: 1,
                borderColor: "#EEF2F7",
                paddingHorizontal: 14,
                paddingVertical: 12,
              },
              shadow,
            ]}
          >
            <Search color={colors.primary} size={18} strokeWidth={2.4} />
            <Text style={{ flex: 1, fontSize: 14, color: "#94A3B8", fontWeight: "600" }}>Search location, area or property...</Text>
            <View style={{ width: 1, height: 20, backgroundColor: "#E2E8F0" }} />
            <Pressable
              onPress={() => setShowFilters(true)}
              style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
            >
              <SlidersHorizontal size={15} color={colors.navy} strokeWidth={2.2} />
              <Text style={{ fontSize: 13, fontWeight: "800", color: colors.navy }}>Filters</Text>
            </Pressable>
          </Pressable>
        </Animated.View>

        {/* ── Category chips ────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 8, paddingHorizontal: 16 }, s(1)]}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#64748B", marginBottom: 8, paddingHorizontal: 4 }}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 2, gap: 8 }}
          >
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                icon={categoryIcons[cat]}
                active={activeCategory === cat}
                onPress={() => setActiveCategory(cat)}
              />
            ))}
          </ScrollView>
        </Animated.View>

        {/* ── Map card ──────────────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 16, paddingHorizontal: 16 }, s(2)]}>
          <Text style={{ fontSize: 12, fontWeight: "700", color: "#64748B", marginBottom: 8, paddingHorizontal: 4 }}>Map Snapshot</Text>
          <MapPreviewCard onOpenMap={() => router.push("/explore-map")} />
        </Animated.View>

        {/* ── Results row ───────────────────────────────────────────────── */}
        <Animated.View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              marginBottom: 10,
            },
            s(3),
          ]}
        >
          <Text style={{ fontSize: 13, color: "#64748B", fontWeight: "600" }}>
            <Text style={{ color: colors.navy, fontWeight: "800", fontSize: 14 }}>{displayCount}</Text>
            {" "}homes found
          </Text>
          <SortPill value={sortBy} onChange={setSortBy} />
        </Animated.View>

        {/* ── Listing cards ─────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 16, gap: 9 }}>
          {visibleListings.map((listing, i) => (
            <Animated.View key={listing.id} style={[cardShadow, s(4 + i * 0.25)]}>
              <ListingCard listing={listing} variant="explore" />
            </Animated.View>
          ))}
        </View>
      </Animated.ScrollView>

      {/* ── Filter modal ──────────────────────────────────────────────────── */}
      <Modal visible={showFilters} animationType="slide" transparent onRequestClose={() => setShowFilters(false)}>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(15,23,42,0.32)" }}>
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 20,
              paddingTop: 14,
              paddingBottom: 32,
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: "#E2E8F0" }} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <Text style={{ fontSize: 20, fontWeight: "800", color: colors.navy }}>Filters</Text>
              <Pressable
                onPress={() => setShowFilters(false)}
                style={{ paddingHorizontal: 14, paddingVertical: 7, backgroundColor: colors.navy, borderRadius: 20 }}
              >
                <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>Done</Text>
              </Pressable>
            </View>

            <Text style={{ fontSize: 13, color: colors.navy, fontWeight: "700", marginBottom: 10 }}>Budget</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {budgetOptions.map((b) => (
                <View key={b} style={{ borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9, backgroundColor: "#F1F5F9" }}>
                  <Text style={{ color: colors.navy, fontSize: 12, fontWeight: "700" }}>{b}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 13, color: colors.navy, fontWeight: "700", marginBottom: 10 }}>Property Type</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
              {propertyTypeOptions.map((kind) => (
                <Pressable
                  key={kind}
                  onPress={() => { setActiveCategory(kind as Category); setShowFilters(false); }}
                  style={{
                    borderRadius: 20,
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    backgroundColor: activeCategory === kind ? "#DCFCE7" : "#F1F5F9",
                    borderWidth: activeCategory === kind ? 1.5 : 0,
                    borderColor: activeCategory === kind ? colors.primary : "transparent",
                  }}
                >
                  <Text style={{ color: colors.navy, fontSize: 12, fontWeight: "700" }}>{kind}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={{ fontSize: 11, color: "#94A3B8", lineHeight: 16 }}>Approximate locations only. Communication stays inside the app via Secure Chat.</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
