import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { router } from "expo-router";
import { Bell, CalendarDays, ChevronRight, Home, MessageCircle, Settings, ShieldCheck, Star, WalletCards } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/assets";
import { listings } from "@/data/mockListings";
import { colors } from "@/constants/colors";

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.07,
  shadowRadius: 10,
  elevation: 3,
};
const cardShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.09,
  shadowRadius: 14,
  elevation: 4,
};

const stats = [
  { value: "12", label: "Listings", icon: Home },
  { value: "48", label: "Chats", icon: MessageCircle },
  { value: "15", label: "Viewings", icon: CalendarDays },
  { value: "4.8", label: "Rating", icon: Star },
];

const overview = [
  { value: "KES 0", label: "Wallet", icon: WalletCards },
  { value: "Secure", label: "Status", icon: ShieldCheck },
  { value: "3", label: "Upcoming", icon: CalendarDays },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "800", color: colors.navy }}>Profile</Text>
            <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "500", marginTop: 1 }}>Manage your account</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable onPress={() => router.push("/notifications")} style={[{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }, shadow]}>
              <Bell size={16} color={colors.navy} />
              <View style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.primary }} />
            </Pressable>
            <Pressable onPress={() => router.push("/settings")} style={[{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }, shadow]}>
              <Settings size={16} color={colors.navy} />
            </Pressable>
          </View>
        </View>

        <View style={[{ marginHorizontal: 16, marginBottom: 14, borderRadius: 22, overflow: "hidden" }, cardShadow]}>
          <LinearGradient colors={["#0F172A", "#1E3A5F"]} style={{ padding: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
              <Image source={images.onboardingPerson} style={{ width: 72, height: 72, borderRadius: 36, borderWidth: 3, borderColor: "#fff" }} resizeMode="cover" />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Text style={{ fontSize: 18, fontWeight: "800", color: "#fff" }}>Brian Kariuki</Text>
                  <ShieldCheck size={16} color={colors.primary} />
                </View>
                <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>Member since May 2026</Text>
                <View style={{ marginTop: 8, alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" }}>
                  <Text style={{ fontSize: 10, fontWeight: "700", color: "#A7F3D0" }}>✓  Verified Account</Text>
                </View>
              </View>
              <Pressable onPress={() => router.push("/settings/edit-profile")} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: "#fff" }}>Edit</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: "row", marginTop: 16, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 16, padding: 12, justifyContent: "space-between" }}>
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <View key={s.label} style={{ alignItems: "center" }}>
                    <Icon size={14} color={colors.primary} />
                    <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", marginTop: 4 }}>{s.value}</Text>
                    <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.6)" }}>{s.label}</Text>
                  </View>
                );
              })}
            </View>
          </LinearGradient>
        </View>

        <View style={[{ marginHorizontal: 16, marginBottom: 14, backgroundColor: "#fff", borderRadius: 20, padding: 14 }, cardShadow]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "800", color: colors.navy }}>Account Overview</Text>
            <Pressable onPress={() => router.push("/payments/escrow-status")} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>View all</Text>
              <ChevronRight size={13} color={colors.primary} />
            </Pressable>
          </View>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {overview.map((item) => {
              const Icon = item.icon;
              return (
                <View key={item.label} style={{ flex: 1, alignItems: "center", borderRadius: 14, borderWidth: 1, borderColor: "#E2E8F0", paddingVertical: 12 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#EEF9F3", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color={colors.primary} />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: "800", color: colors.navy, marginTop: 6 }}>{item.value}</Text>
                  <Text style={{ fontSize: 10, color: "#64748B" }}>{item.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={[{ marginHorizontal: 16, marginBottom: 14, backgroundColor: "#fff", borderRadius: 20, padding: 14 }, cardShadow]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: "800", color: colors.navy }}>My Listings</Text>
            <Pressable onPress={() => router.push("/listing/post")} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>Post listing</Text>
              <ChevronRight size={13} color={colors.primary} />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {listings.slice(0, 3).map((listing) => (
              <Pressable key={listing.id} onPress={() => router.push(`/listing/${listing.id}`)} style={{ width: 150 }}>
                <Image source={listing.image} style={{ width: 150, height: 100, borderRadius: 14 }} resizeMode="cover" />
                <Text style={{ fontSize: 12, fontWeight: "800", color: colors.navy, marginTop: 6 }} numberOfLines={1}>{listing.title}</Text>
                <Text style={{ fontSize: 11, color: "#64748B", marginTop: 1 }}>{listing.location}</Text>
                <Text style={{ fontSize: 12, fontWeight: "800", color: colors.primary, marginTop: 4 }}>{listing.price}/mo</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={[{ marginHorizontal: 16, borderRadius: 20, overflow: "hidden" }, cardShadow]}>
          <LinearGradient colors={[colors.primary, "#0EA56B"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 18, flexDirection: "row", alignItems: "center", gap: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "800", color: "#fff" }}>Get Verified</Text>
              <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", marginTop: 4, lineHeight: 18 }}>Boost trust. More tenants choose verified landlords.</Text>
            </View>
            <Pressable onPress={() => router.push("/settings/verification")} style={{ backgroundColor: "#fff", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "800", color: colors.primary }}>Verify Now</Text>
            </Pressable>
          </LinearGradient>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
