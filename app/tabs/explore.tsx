import { useState } from "react";
import {
  Pressable, ScrollView, StatusBar, Text, View,
} from "react-native";
import { router } from "expo-router";
import {
  BedDouble, ChevronDown, Grid2X2, Heart, Home,
  LocateFixed, LockKeyhole, Map, MapPin, MoreVertical,
  Search, ShieldCheck, SlidersHorizontal,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import { listings } from "@/data/mockListings";
import { colors } from "@/constants/colors";
import { mapListings } from "@/data/mockMapListings";
import { MapPriceMarker } from "@/components/map/MapPriceMarker";

const filters = [
  { label: "All",        icon: Grid2X2 },
  { label: "Bedsitters", icon: Home },
  { label: "1 Bedroom",  icon: BedDouble },
  { label: "2 Bedroom",  icon: BedDouble },
  { label: "3+ Bedroom", icon: BedDouble },
];

const previewRegion = {
  latitude: -1.286389,
  longitude: 36.817223,
  latitudeDelta: 0.22,
  longitudeDelta: 0.14,
};

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
            <Text style={{ fontSize: 32, fontWeight: "800", color: colors.navy, letterSpacing: -0.6 }}>Explore</Text>
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
        <View style={[{ marginHorizontal: 20, marginBottom: 20, borderRadius: 28, overflow: "hidden", height: 246 }, shadowMd]}>
          <MapView
            style={{ width: "100%", height: "100%" }}
            initialRegion={previewRegion}
            mapType="standard"
            customMapStyle={[
              { elementType: "geometry", stylers: [{ color: "#f2f5f7" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#5b6472" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
              { featureType: "poi", stylers: [{ visibility: "off" }] },
              { featureType: "transit", stylers: [{ visibility: "off" }] },
              { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
              { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#dde5eb" }] },
            ]}
            scrollEnabled={false}
            zoomEnabled={false}
            rotateEnabled={false}
            pitchEnabled={false}
            toolbarEnabled={false}
          >
            {mapListings.map((listing) => (
              <Marker
                key={listing.id}
                coordinate={{ latitude: listing.latitude, longitude: listing.longitude }}
                tracksViewChanges={false}
                anchor={{ x: 0.5, y: 1 }}
              >
                <MapPriceMarker price={listing.price} selected={listing.id === "1"} onPress={() => router.push("/explore-map")} />
              </Marker>
            ))}
          </MapView>
          <View style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0, backgroundColor: "rgba(15,23,42,0.03)" }} pointerEvents="none" />

          <Pressable onPress={() => router.push("/explore-map")} style={{ position: "absolute", bottom: 12, left: 0, right: 0, alignItems: "center" }}>
            <View style={[{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#fff", borderRadius: 26, paddingHorizontal: 22, paddingVertical: 12 }, shadowMd]}>
              <Map color={colors.navy} size={20} strokeWidth={2.2} />
              <Text style={{ fontSize: 16, fontWeight: "800", color: colors.navy }}>View on Map</Text>
            </View>
          </Pressable>

          <Pressable onPress={() => router.push("/explore-map")} style={[{ position: "absolute", bottom: 12, right: 12, width: 46, height: 46, borderRadius: 23, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }, shadowMd]}>
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
        <View style={{ paddingHorizontal: 20, gap: 12 }}>
          {listings.map((listing) => (
            <Pressable
              key={listing.id}
              onPress={() => router.push(`/listing/${listing.id}`)}
              style={[{ flexDirection: "row", backgroundColor: "#fff", borderRadius: 20, overflow: "hidden" }, shadow]}
            >
              <View style={{ width: 122, height: 124, position: "relative" }}>
                <Image source={listing.image} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                <View style={{ position: "absolute", bottom: 8, left: 8, flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(0,0,0,0.55)", borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 11, color: "#fff", fontWeight: "700" }}>📷 {listing.photos}</Text>
                </View>
                <Pressable
                  onPress={() => toggleSaved(listing.id)}
                  style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center" }}
                >
                  <Heart size={15} color={saved[listing.id] ? "#EF4444" : "#94A3B8"} fill={saved[listing.id] ? "#EF4444" : "transparent"} strokeWidth={2.2} />
                </Pressable>
              </View>

              <View style={{ flex: 1, paddingHorizontal: 12, paddingVertical: 10, justifyContent: "space-between" }}>
                <View>
                  <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 17, fontWeight: "800", color: colors.navy }}>
                      {listing.price}{" "}
                      <Text style={{ fontSize: 12, fontWeight: "600", color: "#94A3B8" }}>/month</Text>
                    </Text>
                    <Pressable style={{ padding: 2 }}>
                      <MoreVertical size={18} color="#94A3B8" />
                    </Pressable>
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginTop: 2 }} numberOfLines={1}>
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
