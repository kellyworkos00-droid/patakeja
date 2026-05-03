import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { router } from "expo-router";
import {
  ArrowLeft,
  BedDouble,
  CalendarDays,
  ChevronRight,
  LocateFixed,
  Map,
  MapPin,
  Mic,
  Search as SearchIcon,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { listings } from "@/data/mockListings";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";

const areas = ["Kilimani", "Westlands", "Lavington", "Kileleshwa", "Rongai"];
const filters = [
  ["Price", "Any", Tag],
  ["Bedrooms", "Any", BedDouble],
  ["Distance", "Any", MapPin],
  ["Verified", "Verified only", ShieldCheck],
  ["More Filters", "Advanced", SlidersHorizontal],
];
const budgets = ["Under KES 15,000", "KES 15,000 - 25,000", "KES 25,000 - 40,000", "Above KES 40,000"];
const types = ["Bedsitter", "1 Bedroom", "2 Bedroom", "3 Bedroom", "House", "All Types"];

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,
};

const cardShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.1,
  shadowRadius: 16,
  elevation: 6,
};

export default function SearchScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14 }}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              {
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: "#fff",
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.9 : 1,
              },
              shadow,
            ]}
          >
            <ArrowLeft color={colors.navy} size={20} />
          </Pressable>
          <View style={[{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 28, backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 12 }, shadow]}>
            <SearchIcon color={colors.primary} size={18} />
            <Text style={{ flex: 1, fontSize: 14, color: "#94A3B8", fontWeight: "500" }}>Search areas, properties or keywords...</Text>
            <Mic color={colors.navy} size={18} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginBottom: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text style={{ fontSize: 14, color: "#64748B", fontWeight: "500", maxWidth: "58%" }}>Find homes in top locations or near you</Text>
          <Pressable
            onPress={() => router.push("/explore-map")}
            style={({ pressed }) => [
              {
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                borderRadius: 22,
                backgroundColor: "#fff",
                paddingHorizontal: 14,
                paddingVertical: 10,
                opacity: pressed ? 0.9 : 1,
              },
              shadow,
            ]}
          >
            <Map color={colors.navy} size={17} />
            <Text style={{ fontSize: 13, fontWeight: "800", color: colors.navy }}>Map View</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.push("/explore-map")} style={[{ marginHorizontal: 16, marginBottom: 16, borderRadius: 22, overflow: "hidden" }, cardShadow]}>
          <Image source={images.searchDirection} style={{ width: "100%", height: 170 }} resizeMode="cover" />
          <LinearGradient
            colors={["rgba(15,23,42,0)", "rgba(15,23,42,0.72)"]}
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 14, paddingTop: 26, paddingBottom: 12 }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 15, fontWeight: "800", color: "#fff", maxWidth: "70%" }}>Smarter filters and live map pins</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#DCFCE7" }}>Open Map</Text>
                <ChevronRight size={14} color="#DCFCE7" />
              </View>
            </View>
          </LinearGradient>
        </Pressable>

        <Text style={{ marginHorizontal: 16, marginBottom: 10, fontSize: 16, fontWeight: "800", color: colors.navy }}>Popular Areas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4, marginBottom: 16 }}>
          {areas.map((area, index) => (
            <Pressable key={area} style={{ width: 148 }}>
              <Image source={listings[index % listings.length].image} style={{ width: 148, height: 90, borderRadius: 14 }} resizeMode="cover" />
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 7 }}>
                <MapPin color={colors.primary} size={13} />
                <Text style={{ fontSize: 12, fontWeight: "800", color: colors.navy }}>{area}</Text>
              </View>
              <Text style={{ fontSize: 11, color: "#64748B" }}>Nairobi</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={[{ marginHorizontal: 16, marginBottom: 16, flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 20, backgroundColor: "#EAF7EF", padding: 14 }, shadow]}>
          <View style={{ width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
            <LocateFixed color={colors.primary} size={24} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "800", color: colors.navy }}>Homes near me</Text>
            <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>See verified properties around your area</Text>
          </View>
          <Pressable
            onPress={() => router.push("/explore-map")}
            style={({ pressed }) => ({
              borderRadius: 14,
              backgroundColor: colors.primary,
              paddingHorizontal: 13,
              paddingVertical: 10,
              opacity: pressed ? 0.88 : 1,
            })}
          >
            <Text style={{ fontSize: 12, fontWeight: "800", color: "#fff" }}>Use location</Text>
          </Pressable>
        </View>

        <Text style={{ marginHorizontal: 16, marginBottom: 10, fontSize: 16, fontWeight: "800", color: colors.navy }}>Quick Filters</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4, marginBottom: 16 }}>
          {filters.map(([label, value, Icon]) => (
            <Pressable key={label as string} style={[{ width: 132, borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", backgroundColor: "#fff", padding: 12 }, shadow]}>
              <Icon color={colors.primary} size={17} />
              <Text style={{ marginTop: 6, fontSize: 13, fontWeight: "800", color: colors.navy }}>{label as string}</Text>
              <Text style={{ marginTop: 1, fontSize: 11, color: "#64748B" }}>{value as string}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={{ marginHorizontal: 16, marginBottom: 10, fontSize: 16, fontWeight: "800", color: colors.navy }}>Budget Shortcuts</Text>
        <View style={{ marginHorizontal: 16, marginBottom: 16, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {budgets.map((budget) => (
            <Pressable key={budget} style={[{ flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 20, backgroundColor: "#fff", paddingHorizontal: 10, paddingVertical: 8 }, shadow]}>
              <CalendarDays color={colors.primary} size={13} />
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.navy }}>{budget}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ marginHorizontal: 16, marginBottom: 10, fontSize: 16, fontWeight: "800", color: colors.navy }}>Property Type</Text>
        <View style={{ marginHorizontal: 16, marginBottom: 16, flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {types.map((type) => (
            <Pressable key={type} style={[{ width: "31%", alignItems: "center", borderRadius: 14, backgroundColor: "#fff", paddingVertical: 12 }, shadow]}>
              <BedDouble color={colors.navy} size={16} />
              <Text style={{ marginTop: 5, textAlign: "center", fontSize: 11, fontWeight: "700", color: colors.navy }}>{type}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={{ marginHorizontal: 16, marginBottom: 10, fontSize: 16, fontWeight: "800", color: colors.navy }}>Recommended for You</Text>
        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {listings.slice(0, 3).map((listing) => (
            <Pressable
              key={listing.id}
              onPress={() => router.push(`/listing/${listing.id}`)}
              style={[{ flexDirection: "row", gap: 10, borderRadius: 16, backgroundColor: "#fff", padding: 8 }, shadow]}
            >
              <Image source={listing.image} style={{ width: 94, height: 76, borderRadius: 12 }} resizeMode="cover" />
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={{ fontSize: 13, fontWeight: "800", color: colors.navy }} numberOfLines={1}>{listing.price}</Text>
                <Text style={{ marginTop: 2, fontSize: 12, fontWeight: "700", color: colors.navy }} numberOfLines={1}>{listing.title}</Text>
                <View style={{ marginTop: 4, flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <MapPin size={11} color="#94A3B8" />
                  <Text style={{ fontSize: 11, color: "#64748B" }} numberOfLines={1}>{listing.location}</Text>
                </View>
              </View>
              <View style={{ alignSelf: "center", borderRadius: 20, backgroundColor: "#EEF9F3", paddingHorizontal: 7, paddingVertical: 4 }}>
                <ShieldCheck size={11} color={colors.primary} />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
