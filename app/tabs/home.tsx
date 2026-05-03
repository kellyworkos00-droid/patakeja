import { useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { router } from "expo-router";
import {
  Bell,
  ChevronRight,
  Heart,
  MapPin,
  Menu,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { listings, Listing } from "@/data/mockListings";

const { width: SW } = Dimensions.get("window");

const filters = ["All", "Bedsitter", "1 Bedroom", "2 Bedroom", "3 Bedroom"];
const featuredHomes = listings.slice(0, 4);
const recommendedHomes = listings.slice(0, 3);

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 10,
  elevation: 4,
};

function FeaturedCard({ listing }: { listing: Listing }) {
  const [saved, setSaved] = useState(listing.saved ?? false);

  return (
    <Pressable
      onPress={() => router.push(`/listing/${listing.id}`)}
      style={[{ width: 180, borderRadius: 20, backgroundColor: "#fff", overflow: "hidden" }, shadow]}
    >
      <View style={{ height: 108, position: "relative" }}>
        <Image source={listing.image} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(15,23,42,0.55)"]}
          style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
        />
        <Pressable
          onPress={() => setSaved((s) => !s)}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: "rgba(255,255,255,0.95)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Heart size={14} color={saved ? "#EF4444" : "#94A3B8"} fill={saved ? "#EF4444" : "transparent"} strokeWidth={2.2} />
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 10, paddingVertical: 9 }}>
        <Text style={{ fontSize: 14, fontWeight: "800", color: colors.navy }} numberOfLines={1}>{listing.price}</Text>
        <Text style={{ fontSize: 12, fontWeight: "700", color: colors.navy, marginTop: 2 }} numberOfLines={1}>{listing.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 5 }}>
          <MapPin size={11} color="#94A3B8" />
          <Text style={{ fontSize: 11, color: "#64748B", fontWeight: "600", flex: 1 }} numberOfLines={1}>{listing.location}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 7, justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <Star size={11} color="#F59E0B" fill="#F59E0B" />
            <Text style={{ fontSize: 11, fontWeight: "700", color: "#334155" }}>4.8</Text>
          </View>
          <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>{listing.distance}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function RecommendedRow({ listing }: { listing: Listing }) {
  const [saved, setSaved] = useState(listing.saved ?? false);

  return (
    <Pressable
      onPress={() => router.push(`/listing/${listing.id}`)}
      style={[{ flexDirection: "row", gap: 10, backgroundColor: "#fff", borderRadius: 18, padding: 9, marginBottom: 10 }, shadow]}
    >
      <View style={{ width: 92, height: 82, borderRadius: 12, overflow: "hidden", position: "relative" }}>
        <Image source={listing.image} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        <Pressable
          onPress={() => setSaved((s) => !s)}
          style={{
            position: "absolute",
            top: 5,
            right: 5,
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: "rgba(255,255,255,0.94)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Heart size={12} color={saved ? "#EF4444" : "#94A3B8"} fill={saved ? "#EF4444" : "transparent"} strokeWidth={2.2} />
        </Pressable>
      </View>

      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={{ fontSize: 15, fontWeight: "800", color: colors.navy }}>{listing.price}</Text>
        <Text style={{ fontSize: 12, fontWeight: "700", color: colors.navy, marginTop: 1 }} numberOfLines={1}>{listing.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 }}>
          <MapPin size={11} color="#94A3B8" />
          <Text style={{ fontSize: 11, color: "#64748B", fontWeight: "600" }} numberOfLines={1}>{listing.location}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}>
          <Pressable
            style={[{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }, shadow]}
          >
            <Menu size={20} color={colors.navy} strokeWidth={2.5} />
          </Pressable>

          <Pressable
            onPress={() => router.push("/search")}
            style={[
              {
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fff",
                borderRadius: 22,
                paddingLeft: 12,
                paddingRight: 8,
                height: 44,
                gap: 8,
              },
              shadow,
            ]}
          >
            <Search size={17} color="#94A3B8" />
            <Text style={{ flex: 1, fontSize: 13, color: "#94A3B8", fontWeight: "600" }}>Search your dream home</Text>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center" }}>
              <SlidersHorizontal size={14} color="#fff" />
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push("/notifications")}
            style={[{ width: 42, height: 42, borderRadius: 21, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }, shadow]}
          >
            <Bell size={18} color={colors.navy} />
            <View style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }} />
          </Pressable>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 16, marginBottom: 12 }}>
          {filters.map((label, index) => (
            <Pressable
              key={label}
              onPress={() => setActiveFilter(index)}
              style={[
                {
                  height: 34,
                  borderRadius: 17,
                  paddingHorizontal: 14,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: activeFilter === index ? colors.navy : "#fff",
                },
                shadow,
              ]}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: activeFilter === index ? "#fff" : colors.navy }}>{label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={{ marginHorizontal: 16, marginBottom: 16, borderRadius: 24, overflow: "hidden", backgroundColor: colors.navy }}>
          <View style={{ width: SW - 32, height: 168, position: "relative" }}>
            <Image source={images.homeDirection} style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "52%", height: "100%" }} resizeMode="cover" />
            <LinearGradient
              colors={["#0F172A", "rgba(15,23,42,0.6)", "rgba(15,23,42,0.2)"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
            />

            <View style={{ position: "absolute", left: 14, top: 14 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", letterSpacing: 1, color: "#A7F3D0" }}>WELCOME HOME</Text>
              <Text style={{ fontSize: 22, fontWeight: "800", lineHeight: 28, color: "#fff", marginTop: 4 }}>
                Find your{"\n"}perfect place
              </Text>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>
                Verified, secure, and affordable.
              </Text>

              <Pressable
                onPress={() => router.push("/search")}
                style={{
                  marginTop: 10,
                  backgroundColor: colors.primary,
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 7,
                  alignSelf: "flex-start",
                }}
              >
                <Text style={{ fontSize: 12, color: "#fff", fontWeight: "800" }}>Explore now</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, marginBottom: 10 }}>
            <Text style={{ fontSize: 17, fontWeight: "800", color: colors.navy }}>Featured Homes</Text>
            <Pressable onPress={() => router.push("/search")} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary }}>See all</Text>
              <ChevronRight size={14} color={colors.primary} />
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}>
            {featuredHomes.map((item) => (
              <FeaturedCard key={item.id} listing={item} />
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ fontSize: 17, fontWeight: "800", color: colors.navy }}>Recommended</Text>
            <Pressable onPress={() => router.push("/search")} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary }}>See all</Text>
              <ChevronRight size={14} color={colors.primary} />
            </Pressable>
          </View>

          {recommendedHomes.map((item) => (
            <RecommendedRow key={item.id} listing={item} />
          ))}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.push("/search")}
        style={[
          {
            position: "absolute",
            bottom: 94,
            right: 16,
            borderRadius: 18,
            backgroundColor: colors.navy,
            paddingHorizontal: 14,
            paddingVertical: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          },
          shadow,
        ]}
      >
        <MapPin size={14} color="#fff" />
        <Text style={{ fontSize: 12, fontWeight: "800", color: "#fff" }}>View map</Text>
      </Pressable>
    </SafeAreaView>
  );
}
