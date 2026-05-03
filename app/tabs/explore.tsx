import { useState } from "react";
import {
  Image, Pressable, ScrollView, StatusBar, Text, View,
} from "react-native";
import { router } from "expo-router";
import {
  BedDouble, ChevronDown, Grid2X2, Heart, Home,
  LocateFixed, LockKeyhole, Map, MapPin, MoreVertical,
  Search, ShieldCheck, SlidersHorizontal,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { listings } from "@/data/mockListings";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";

const filters = [
  { label: "All",        icon: Grid2X2 },
  { label: "Bedsitters", icon: Home },
  { label: "1 Bedroom",  icon: BedDouble },
  { label: "2 Bedroom",  icon: BedDouble },
  { label: "3+ Bedroom", icon: BedDouble },
];

const clusters = [
  { label: "12", top: "42%", left: "14%" },
  { label: "28", top: "54%", left: "42%" },
  { label: "15", top: "46%", left: "70%" },
];

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 12,
  elevation: 4,
};

const shadowMd = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.10,
  shadowRadius: 18,
  elevation: 7,
};

function TrustPill({ type }: { type: "Verified" | "Secure Chat" | "Escrow" }) {
  const cfg = {
    Verified:      { icon: ShieldCheck, bg: "#DCFCE7", color: colors.primary },
    "Secure Chat": { icon: LockKeyhole, bg: "#FEF3C7", color: "#D97706" },
    Escrow:        { icon: ShieldCheck, bg: "#EDE9FE", color: "#7C3AED" },
  }[type];
  const Icon = cfg.icon;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: cfg.bg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 }}>
      <Icon size={11} color={cfg.color} strokeWidth={2.8} />
      <Text style={{ fontSize: 11, fontWeight: "700", color: cfg.color }}>{type}</Text>
    </View>
  );
}

export default function ExploreScreen() {
  const [activeFilter, setActiveFilter] = useState(0);
  const [saved, setSaved] = useState<Record<string, boolean>>(
    Object.fromEntries(listings.map((l) => [l.id, l.saved ?? false]))
  );
  const toggleSaved = (id: string) => setSaved((s) => ({ ...s, [id]: !s[id] }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* ── Header ── */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14 }}>
          <View>
            <Text style={{ fontSize: 46, fontWeight: "800", color: colors.navy, letterSpacing: -0.8 }}>Explore</Text>
            <Text style={{ fontSize: 14, color: "#64748B", fontWeight: "500", marginTop: 2 }}>Find your perfect home</Text>
          </View>
          <Pressable
            onPress={() => router.push("/search")}
            style={[{ width: 58, height: 58, borderRadius: 29, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginTop: 4 }, shadowMd]}
          >
            <SlidersHorizontal color={colors.navy} size={21} />
            <View style={{ position: "absolute", top: 14, right: 14, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary, borderWidth: 1.5, borderColor: "#F8FAFC" }} />
          </Pressable>
        </View>

        {/* ── Search bar ── */}
        <Pressable
          onPress={() => router.push("/search")}
          style={[{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#fff", borderRadius: 24, paddingHorizontal: 20, paddingVertical: 17, marginHorizontal: 20, marginBottom: 16 }, shadowMd]}
        >
          <Search color={colors.primary} size={22} strokeWidth={2.4} />
          <Text style={{ flex: 1, fontSize: 18, color: "#94A3B8", fontWeight: "500" }}>Search location, area or property...</Text>
          <View style={{ width: 1, height: 24, backgroundColor: "#E2E8F0", marginHorizontal: 2 }} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <SlidersHorizontal size={17} color={colors.navy} />
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.navy }}>Filters</Text>
          </View>
        </Pressable>

        {/* ── Filter chips ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 12, paddingBottom: 6, marginBottom: 18 }}
        >
          {filters.map((f, i) => {
            const Icon = f.icon;
            const active = i === activeFilter;
            return (
              <Pressable
                key={f.label}
                onPress={() => setActiveFilter(i)}
                style={[{ flexDirection: "row", alignItems: "center", gap: 7, height: 52, borderRadius: 26, paddingHorizontal: 20, backgroundColor: active ? colors.navy : "#fff" }, active ? shadow : shadow]}
              >
                <Icon color={active ? "#fff" : colors.navy} size={18} strokeWidth={active ? 2.6 : 2.2} />
                <Text style={{ fontSize: 15, fontWeight: "700", color: active ? "#fff" : colors.navy }}>{f.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── Map preview ── */}
        <View style={[{ marginHorizontal: 20, marginBottom: 22, borderRadius: 28, overflow: "hidden", height: 292 }, shadowMd]}>
          <Image source={images.exploreDirection} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
          <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(255,255,255,0.08)" }} />

          {clusters.map((c) => (
            <View
              key={c.label}
              style={{
                position: "absolute", top: c.top as any, left: c.left as any,
                width: 58, height: 58, borderRadius: 29,
                backgroundColor: colors.primary,
                alignItems: "center", justifyContent: "center",
                borderWidth: 3, borderColor: "#fff",
                shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 5,
              }}
            >
              <Text style={{ fontSize: 29, fontWeight: "800", color: "#fff", lineHeight: 31 }}>{c.label}</Text>
            </View>
          ))}

          <Pressable onPress={() => router.push("/explore-map")} style={{ position: "absolute", bottom: 16, left: 0, right: 0, alignItems: "center" }}>
            <View style={[{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 26, paddingHorizontal: 22, paddingVertical: 12 }, shadowMd]}>
              <Map color={colors.navy} size={20} strokeWidth={2.2} />
              <Text style={{ fontSize: 16, fontWeight: "800", color: colors.navy }}>View on Map</Text>
            </View>
          </Pressable>

          <Pressable style={[{ position: "absolute", bottom: 16, right: 16, width: 50, height: 50, borderRadius: 25, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }, shadowMd]}>
            <LocateFixed color={colors.navy} size={21} strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* ── Results bar ── */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: "#64748B" }}>
            <Text style={{ color: colors.navy, fontWeight: "800" }}>256</Text> homes found
          </Text>
          <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 14, fontWeight: "700", color: colors.navy }}>Sort by: Newest</Text>
            <ChevronDown color={colors.navy} size={16} strokeWidth={2.4} />
          </Pressable>
        </View>

        {/* ── Listing cards ── */}
        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          {listings.map((listing) => (
            <Pressable
              key={listing.id}
              onPress={() => router.push(`/listing/${listing.id}`)}
              style={[{ flexDirection: "row", backgroundColor: "#fff", borderRadius: 22, overflow: "hidden" }, shadow]}
            >
              <View style={{ width: 130, height: 138, position: "relative" }}>
                <Image source={listing.image} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                <View style={{ position: "absolute", bottom: 8, left: 8, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(0,0,0,0.55)", borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 11, color: "#fff", fontWeight: "700" }}>📷 {listing.photos}</Text>
                </View>
                <Pressable
                  onPress={() => toggleSaved(listing.id)}
                  style={{ position: "absolute", top: 8, right: 8, width: 30, height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center" }}
                >
                  <Heart size={15} color={saved[listing.id] ? "#EF4444" : "#94A3B8"} fill={saved[listing.id] ? "#EF4444" : "transparent"} strokeWidth={2.2} />
                </Pressable>
              </View>

              <View style={{ flex: 1, padding: 12, justifyContent: "space-between" }}>
                <View>
                  <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 18, fontWeight: "800", color: colors.navy }}>
                      {listing.price}{" "}
                      <Text style={{ fontSize: 12, fontWeight: "600", color: "#94A3B8" }}>/month</Text>
                    </Text>
                    <Pressable style={{ padding: 2 }}>
                      <MoreVertical size={18} color="#94A3B8" />
                    </Pressable>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: colors.navy, marginTop: 2 }} numberOfLines={1}>
                    {listing.title}
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 5 }}>
                    <MapPin size={12} color="#94A3B8" />
                    <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "500" }} numberOfLines={1}>
                      {listing.location}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#CBD5E1" }}>·</Text>
                    <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "700" }}>{listing.distance}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                  <TrustPill type="Verified" />
                  <TrustPill type="Secure Chat" />
                  <TrustPill type="Escrow" />
                </View>
              </View>
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
