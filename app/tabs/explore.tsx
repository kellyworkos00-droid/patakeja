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
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
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

const { width: SW } = Dimensions.get("window");

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

const chipShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 14,
  elevation: 6,
};

const cardShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.1,
  shadowRadius: 18,
  elevation: 8,
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
  const iconBg = active ? "rgba(255,255,255,0.18)" : "#F8FAFC";
  const activeProgress = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(activeProgress, {
      toValue: active ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [active, activeProgress]);

  const chipScale = activeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.025],
  });

  const haloOpacity = activeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const haloScale = activeProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.04],
  });

  return (
    <Animated.View style={{ transform: [{ scale: chipScale }] }}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            height: 42,
            borderRadius: 21,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            gap: 8,
            backgroundColor: active ? "#0B1220" : "#FFFFFF",
            borderWidth: 1,
            borderColor: active ? "#1E293B" : "#E2E8F0",
            transform: [{ scale: pressed ? 0.96 : 1 }],
          },
          chipShadow,
        ]}
      >
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: -1,
            right: -1,
            bottom: -1,
            left: -1,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: "rgba(22,163,74,0.48)",
            opacity: haloOpacity,
            transform: [{ scale: haloScale }],
          }}
        />

        {Icon ? (
          <View
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: iconBg,
              borderWidth: active ? 0 : 1,
              borderColor: "#E2E8F0",
            }}
          >
            <Icon color={color} size={13} strokeWidth={2.1} />
          </View>
        ) : null}
        <Text style={{ fontSize: 13, fontWeight: "700", color, letterSpacing: 0.1 }}>{label}</Text>
      </Pressable>
    </Animated.View>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#EEF2F7" }} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#EEF2F7" />

      {/* ── Floating search bar (appears on scroll) ─────────────────────── */}
      <Animated.View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 10, left: 14, right: 14, zIndex: 20,
          opacity: floatOpacity,
          transform: [{ translateY: floatTranslateY }, { scale: floatScale }],
        }}
      >
        <Pressable
          onPress={() => router.push("/search")}
          style={{
            flexDirection: "row", alignItems: "center", backgroundColor: "#fff",
            borderRadius: 24, height: 46, paddingLeft: 14, paddingRight: 9, gap: 8,
            shadowColor: "#0F172A", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.13, shadowRadius: 20, elevation: 10,
          }}
        >
          <Search size={16} color="#16A34A" strokeWidth={2.4} />
          <Text style={{ flex: 1, fontSize: 13, color: "#94A3B8", fontWeight: "600" }}>Search location, area or property...</Text>
          <Pressable
            onPress={() => setShowFilters(true)}
            style={{ overflow: "hidden", borderRadius: 16 }}
          >
            <LinearGradient
              colors={["#1E3A5F", "#0F172A"]}
              style={{ flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 16, paddingHorizontal: 11, paddingVertical: 7 }}
            >
              <SlidersHorizontal size={13} color="#fff" strokeWidth={2.2} />
              <Text style={{ fontSize: 12, fontWeight: "800", color: "#fff" }}>Filters</Text>
            </LinearGradient>
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
        {/* ── Header ─────────────────────────────────────────────────── */}
        <Animated.View
          style={[{
            marginHorizontal: 16, marginTop: 8, marginBottom: 14,
            borderRadius: 24, overflow: "hidden",
            opacity: headerOpacity, transform: [{ translateY: headerTranslateY }],
          }, shadow]}
        >
          <LinearGradient
            colors={["#0F172A", "#1E3A5F"]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            style={{ paddingHorizontal: 18, paddingVertical: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
          >
            <View>
              <Text style={{ fontSize: 11, fontWeight: "700", color: "#16A34A", letterSpacing: 1.5 }}>DISCOVER</Text>
              <Text style={{ fontSize: 28, fontWeight: "900", color: "#fff", letterSpacing: -0.8, marginTop: 2 }}>Explore</Text>
              <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: "500", marginTop: 3 }}>Find your perfect home</Text>
            </View>
            <Pressable
              onPress={() => setShowFilters(true)}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: "rgba(255,255,255,0.12)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.18)" }}>
                <SlidersHorizontal color="#fff" size={19} strokeWidth={2.2} />
                <View style={{ position: "absolute", top: 9, right: 9, width: 9, height: 9, borderRadius: 5, backgroundColor: "#16A34A", borderWidth: 1.5, borderColor: "#1E3A5F" }} />
              </View>
            </Pressable>
          </LinearGradient>
        </Animated.View>

        {/* ── Search bar ─────────────────────────────────────────────── */}
        <Animated.View style={[{ paddingHorizontal: 16, marginBottom: 12 }, s(0)]}>
          <Pressable
            onPress={() => router.push("/search")}
            style={({ pressed }) => [{
              flexDirection: "row", alignItems: "center", gap: 10,
              backgroundColor: "#fff", borderRadius: 20,
              paddingHorizontal: 14, paddingVertical: 13,
              opacity: pressed ? 0.9 : 1,
            }, shadow]}
          >
            <Search color="#16A34A" size={18} strokeWidth={2.4} />
            <Text style={{ flex: 1, fontSize: 14, color: "#94A3B8", fontWeight: "600" }}>Search location, area or property...</Text>
            <View style={{ width: 1, height: 20, backgroundColor: "#E2E8F0" }} />
            <Pressable onPress={() => setShowFilters(true)} style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <SlidersHorizontal size={15} color={colors.navy} strokeWidth={2.2} />
              <Text style={{ fontSize: 13, fontWeight: "800", color: colors.navy }}>Filters</Text>
            </Pressable>
          </Pressable>
        </Animated.View>

        {/* ── Category chips ─────────────────────────────────────────── */}
        <Animated.View style={[{ marginBottom: 10, paddingHorizontal: 16 }, s(1)]}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: "#94A3B8", marginBottom: 9, paddingHorizontal: 4, letterSpacing: 0.8 }}>CATEGORIES</Text>
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
        <Animated.View style={[{ marginBottom: 18, paddingHorizontal: 16 }, s(2)]}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: "#94A3B8", marginBottom: 9, paddingHorizontal: 4, letterSpacing: 0.8 }}>MAP SNAPSHOT</Text>
          <MapPreviewCard onOpenMap={() => router.push("/explore-map")} />
        </Animated.View>

        {/* ── Section divider ───────────────────────────────────────────── */}
        <View style={{ height: 1, backgroundColor: "#DDE3EC", marginHorizontal: 16, marginBottom: 18 }} />

        {/* ── Results row ────────────────────────────────────────────── */}
        <Animated.View style={[{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 12 }, s(3)]}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: "900", color: "#0F172A", letterSpacing: -0.3 }}>
              {displayCount} <Text style={{ color: "#64748B", fontWeight: "600", fontSize: 14 }}>homes found</Text>
            </Text>
          </View>
          <SortPill value={sortBy} onChange={setSortBy} />
        </Animated.View>

        {/* ── Listing cards ─────────────────────────────────────────────── */}
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {visibleListings.map((listing, i) => (
            <Animated.View key={listing.id} style={s(4 + i * 0.25)}>
              <ListingCard listing={listing} variant="explore" />
            </Animated.View>
          ))}
        </View>
      </Animated.ScrollView>

      {/* ── Filter modal ──────────────────────────────────────────────────── */}
      <Modal visible={showFilters} animationType="slide" transparent onRequestClose={() => setShowFilters(false)}>
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(15,23,42,0.45)" }}>
          <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 36 }}>
            {/* Handle */}
            <View style={{ alignItems: "center", marginBottom: 18 }}>
              <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: "#E2E8F0" }} />
            </View>

            {/* Title row */}
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <View>
                <Text style={{ fontSize: 22, fontWeight: "900", color: "#0F172A", letterSpacing: -0.4 }}>Filters</Text>
                <Text style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Narrow down your search</Text>
              </View>
              <Pressable
                onPress={() => setShowFilters(false)}
                style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
              >
                <LinearGradient
                  colors={["#0F172A", "#1E3A5F"]}
                  style={{ paddingHorizontal: 18, paddingVertical: 9, borderRadius: 20 }}
                >
                  <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>Apply</Text>
                </LinearGradient>
              </Pressable>
            </View>

            {/* Budget */}
            <Text style={{ fontSize: 11, fontWeight: "700", color: "#94A3B8", letterSpacing: 0.8, marginBottom: 10 }}>BUDGET</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
              {budgetOptions.map((b) => (
                <Pressable
                  key={b}
                  style={({ pressed }) => ({
                    borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10,
                    backgroundColor: "#F1F5F9", opacity: pressed ? 0.8 : 1,
                    borderWidth: 1.5, borderColor: "#E2E8F0",
                  })}
                >
                  <Text style={{ color: colors.navy, fontSize: 13, fontWeight: "700" }}>{b}</Text>
                </Pressable>
              ))}
            </View>

            {/* Property type */}
            <Text style={{ fontSize: 11, fontWeight: "700", color: "#94A3B8", letterSpacing: 0.8, marginBottom: 10 }}>PROPERTY TYPE</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {propertyTypeOptions.map((kind) => {
                const active = activeCategory === kind;
                return (
                  <Pressable
                    key={kind}
                    onPress={() => { setActiveCategory(kind as Category); setShowFilters(false); }}
                    style={({ pressed }) => ({
                      borderRadius: 14, paddingHorizontal: 16, paddingVertical: 10,
                      backgroundColor: active ? "#DCFCE7" : "#F1F5F9",
                      borderWidth: 1.5,
                      borderColor: active ? colors.primary : "#E2E8F0",
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Text style={{ color: active ? "#15803D" : colors.navy, fontSize: 13, fontWeight: "700" }}>{kind}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ height: 1, backgroundColor: "#F1F5F9", marginBottom: 16 }} />
            <Text style={{ fontSize: 11, color: "#94A3B8", lineHeight: 17 }}>Approximate locations only. Communication stays inside the app via Secure Chat.</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
