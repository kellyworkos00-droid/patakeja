import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { router } from "expo-router";
import {
  Bell, CalendarDays, ChevronRight, Home, MessageCircle,
  Settings, ShieldCheck, Star, WalletCards, Edit3,
  MapPin, Phone, Heart, Grid3X3, BookOpen,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants/assets";
import { listings } from "@/data/mockListings";
import { colors } from "@/constants/colors";

import { images } from "@/constants/assets";
import { listings } from "@/data/mockListings";
import { colors } from "@/constants/colors";

const stats = [
  { value: "12", label: "Listings", icon: Home },
  { value: "48", label: "Chats",    icon: MessageCircle },
  { value: "15", label: "Viewings", icon: CalendarDays },
  { value: "4.8", label: "Rating",  icon: Star },
];

const quickActions = [
  { label: "Post Listing", icon: Grid3X3, color: "#FFFFFF", bg: "#16A34A", route: "/listing/post" },
  { label: "My Listings",  icon: BookOpen, color: "#0B1D45", bg: "#FFFFFF",  route: "/tabs/home" },
];

const menuItems = [
  { label: "My Bookings",    sub: "3 upcoming",        icon: CalendarDays,  color: "#6366F1", bg: "#EEF2FF", route: "/tabs/bookings" },
  { label: "Saved Listings", sub: "7 properties",      icon: Heart,         color: "#EF4444", bg: "#FEF2F2", route: "/saved" },
  { label: "My Wallet",      sub: "KES 0 balance",     icon: WalletCards,   color: "#F59E0B", bg: "#FFFBEB", route: "/payments/escrow-status" },
  { label: "Notifications",  sub: "3 new alerts",      icon: Bell,          color: "#0EA5E9", bg: "#F0F9FF", route: "/notifications" },
  { label: "Verification",   sub: "Identity + docs",   icon: ShieldCheck,   color: "#16A34A", bg: "#F0FDF4", route: "/settings/verification" },
  { label: "Edit Profile",   sub: "Name, photo, bio",  icon: Edit3,         color: "#8B5CF6", bg: "#F5F3FF", route: "/settings/edit-profile" },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F0F4F8" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0F4F8" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        {/* ── Top Nav ── */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6 }}>
          <Text style={{ fontSize: 26, fontWeight: "900", color: "#0B1D45", letterSpacing: -0.5 }}>Profile</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={() => router.push("/notifications")}
              style={({ pressed }) => ({
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: pressed ? "#E8EDF3" : "#FFFFFF",
                alignItems: "center", justifyContent: "center",
                shadowColor: "#0B1D45", shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
              })}
            >
              <Bell size={18} color="#0B1D45" strokeWidth={2} />
              <View style={{ position: "absolute", top: 9, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: "#16A34A", borderWidth: 2, borderColor: "#FFFFFF" }} />
            </Pressable>
            <Pressable
              onPress={() => router.push("/settings")}
              style={({ pressed }) => ({
                width: 44, height: 44, borderRadius: 22,
                backgroundColor: pressed ? "#E8EDF3" : "#FFFFFF",
                alignItems: "center", justifyContent: "center",
                shadowColor: "#0B1D45", shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
              })}
            >
              <Settings size={18} color="#0B1D45" strokeWidth={2} />
            </Pressable>
          </View>
        </View>

        {/* ── Hero Card ── */}
        <View style={{
          marginHorizontal: 16, marginTop: 8, borderRadius: 28, overflow: "hidden",
          shadowColor: "#0B1D45", shadowOpacity: 0.18, shadowRadius: 30, elevation: 12,
        }}>
          <LinearGradient colors={["#0B1D45", "#1A3560", "#0D2B4E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 22 }}>
            {/* Avatar row */}
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
              <View style={{ position: "relative" }}>
                <View style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
                  <Image source={images.onboardingPerson} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                </View>
                <View style={{ position: "absolute", bottom: 3, right: 3, width: 16, height: 16, borderRadius: 8, backgroundColor: "#16A34A", borderWidth: 2.5, borderColor: "#0B1D45" }} />
              </View>
              <View style={{ flex: 1, paddingTop: 2 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Text style={{ fontSize: 21, fontWeight: "900", color: "#FFFFFF", letterSpacing: -0.4 }}>Brian Kariuki</Text>
                  <ShieldCheck size={18} color="#16A34A" strokeWidth={2} />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 }}>
                  <MapPin size={12} color="rgba(255,255,255,0.5)" strokeWidth={2} />
                  <Text style={{ fontSize: 12.5, color: "rgba(255,255,255,0.55)", fontWeight: "500" }}>Nairobi, Kenya</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 3 }}>
                  <Phone size={11} color="rgba(255,255,255,0.4)" strokeWidth={2} />
                  <Text style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)" }}>+254 712 345 678</Text>
                </View>
              </View>
              <Pressable
                onPress={() => router.push("/settings/edit-profile")}
                style={({ pressed }) => ({
                  paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
                  backgroundColor: pressed ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.1)",
                  borderWidth: 1, borderColor: "rgba(255,255,255,0.2)",
                })}
              >
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#FFFFFF" }}>Edit</Text>
              </Pressable>
            </View>

            {/* Verified pill */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 16, alignSelf: "flex-start", backgroundColor: "rgba(22,163,74,0.2)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: "rgba(22,163,74,0.35)" }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#4ADE80" }} />
              <Text style={{ fontSize: 10.5, fontWeight: "700", color: "#4ADE80", letterSpacing: 0.3 }}>VERIFIED  ·  Member since May 2026</Text>
            </View>

            {/* Stats row */}
            <View style={{ flexDirection: "row", marginTop: 18, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 18, paddingVertical: 14, paddingHorizontal: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" }}>
              {stats.map((s, i) => {
                const Icon = s.icon;
                return (
                  <View key={s.label} style={{ flex: 1, alignItems: "center", borderRightWidth: i < stats.length - 1 ? 1 : 0, borderRightColor: "rgba(255,255,255,0.1)" }}>
                    <Icon size={14} color="#4ADE80" strokeWidth={2} />
                    <Text style={{ fontSize: 18, fontWeight: "900", color: "#FFFFFF", marginTop: 5, letterSpacing: -0.3 }}>{s.value}</Text>
                    <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", marginTop: 2, fontWeight: "500" }}>{s.label}</Text>
                  </View>
                );
              })}
            </View>
          </LinearGradient>
        </View>

        {/* ── Quick Actions ── */}
        <View style={{ flexDirection: "row", marginHorizontal: 16, marginTop: 16, gap: 10 }}>
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Pressable
                key={a.label}
                onPress={() => router.push(a.route as any)}
                style={({ pressed }) => ({
                  flex: 1, height: 52, borderRadius: 18, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                  backgroundColor: pressed ? (a.bg === "#16A34A" ? "#15803D" : "#F1F5F9") : a.bg,
                  shadowColor: "#0B1D45", shadowOpacity: 0.08, shadowRadius: 12, elevation: 3,
                  borderWidth: a.bg === "#FFFFFF" ? 1 : 0, borderColor: "#E8EDF3",
                })}
              >
                <Icon size={17} color={a.color} strokeWidth={2.2} />
                <Text style={{ fontSize: 14, fontWeight: "700", color: a.color }}>{a.label}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── My Listings carousel ── */}
        <View style={{ marginTop: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 12 }}>
            <Text style={{ fontSize: 17, fontWeight: "800", color: "#0B1D45", letterSpacing: -0.3 }}>My Listings</Text>
            <Pressable onPress={() => router.push("/listing/post" as any)} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#16A34A" }}>Post new</Text>
              <ChevronRight size={14} color="#16A34A" strokeWidth={2.5} />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
            {listings.slice(0, 4).map((listing) => (
              <Pressable
                key={listing.id}
                onPress={() => router.push(`/listing/${listing.id}` as any)}
                style={({ pressed }) => ({
                  width: 160, borderRadius: 20, overflow: "hidden",
                  backgroundColor: "#FFFFFF",
                  shadowColor: "#0B1D45", shadowOpacity: 0.08, shadowRadius: 14, elevation: 4,
                  opacity: pressed ? 0.92 : 1,
                })}
              >
                <Image source={listing.image} style={{ width: 160, height: 110 }} resizeMode="cover" />
                <View style={{ padding: 10 }}>
                  <Text style={{ fontSize: 12.5, fontWeight: "800", color: "#0B1D45", lineHeight: 17 }} numberOfLines={2}>{listing.title}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 }}>
                    <MapPin size={10} color="#94A3B8" strokeWidth={2} />
                    <Text style={{ fontSize: 11, color: "#94A3B8" }} numberOfLines={1}>{listing.location}</Text>
                  </View>
                  <Text style={{ fontSize: 13.5, fontWeight: "900", color: "#16A34A", marginTop: 6 }}>
                    {listing.price}<Text style={{ fontSize: 10, fontWeight: "500", color: "#94A3B8" }}>/mo</Text>
                  </Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* ── Account Menu ── */}
        <View style={{ marginHorizontal: 16, marginTop: 20 }}>
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#0B1D45", letterSpacing: -0.3, marginBottom: 12 }}>Account</Text>
          <View style={{ gap: 10 }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.label}
                  onPress={() => router.push(item.route as any)}
                  style={({ pressed }) => ({
                    flexDirection: "row", alignItems: "center", gap: 14,
                    backgroundColor: pressed ? "#F1F5F9" : "#FFFFFF",
                    borderRadius: 20, paddingHorizontal: 16, paddingVertical: 14,
                    shadowColor: "#0B1D45", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
                  })}
                >
                  <View style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: item.bg, alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} color={item.color} strokeWidth={2} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: "#0B1D45" }}>{item.label}</Text>
                    <Text style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{item.sub}</Text>
                  </View>
                  <ChevronRight size={18} color="#CBD5E1" strokeWidth={2.5} />
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Verify CTA ── */}
        <View style={{ marginHorizontal: 16, marginTop: 20, borderRadius: 24, overflow: "hidden", shadowColor: "#16A34A", shadowOpacity: 0.2, shadowRadius: 20, elevation: 8 }}>
          <LinearGradient colors={["#16A34A", "#0D9040", "#0A7A36"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ padding: 20, flexDirection: "row", alignItems: "center", gap: 16 }}>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
              <ShieldCheck size={26} color="#FFFFFF" strokeWidth={2} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "900", color: "#FFFFFF", letterSpacing: -0.3 }}>Get Verified Today</Text>
              <Text style={{ fontSize: 12.5, color: "rgba(255,255,255,0.8)", marginTop: 4, lineHeight: 18 }}>Verified landlords get 3× more inquiries.</Text>
            </View>
            <Pressable
              onPress={() => router.push("/settings/verification")}
              style={({ pressed }) => ({
                backgroundColor: pressed ? "#F0FDF4" : "#FFFFFF",
                borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10,
              })}
            >
              <Text style={{ fontSize: 13, fontWeight: "800", color: "#16A34A" }}>Verify</Text>
            </Pressable>
          </LinearGradient>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
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
