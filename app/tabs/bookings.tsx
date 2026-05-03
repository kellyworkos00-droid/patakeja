import { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { router } from "expo-router";
import { Bell, CalendarDays, ChevronRight, Clock, MapPin } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { bookings } from "@/data/mockBookings";
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

const statusColors: Record<string, { bg: string; text: string }> = {
  Confirmed: { bg: "#EEF9F3", text: "#065F46" },
  Pending: { bg: "#FEF9EC", text: "#854D0E" },
  Completed: { bg: "#F1F5F9", text: "#475569" },
};

export default function MyBookingsScreen() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const upcoming = bookings.filter((b) => b.status !== "Completed");
  const past = bookings.filter((b) => b.status === "Completed");
  const shown = activeTab === "upcoming" ? upcoming : past;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "800", color: colors.navy }}>Bookings</Text>
            <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "500", marginTop: 1 }}>Your viewing schedule</Text>
          </View>
          <Pressable onPress={() => router.push("/notifications")} style={[{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }, shadow]}>
            <Bell size={16} color={colors.navy} />
          </Pressable>
        </View>

        <View style={[{ marginHorizontal: 16, marginBottom: 14, borderRadius: 20, overflow: "hidden" }, cardShadow]}>
          <LinearGradient colors={["#0F172A", "#1E3A5F"]} style={{ flexDirection: "row", paddingVertical: 16 }}>
            {[
              { value: String(upcoming.length), label: "Upcoming" },
              { value: String(past.length), label: "Completed" },
              { value: "0", label: "Cancelled" },
            ].map((s, i) => (
              <View key={s.label} style={{ flex: 1, alignItems: "center", borderRightWidth: i < 2 ? 1 : 0, borderRightColor: "rgba(255,255,255,0.12)" }}>
                <Text style={{ fontSize: 22, fontWeight: "800", color: "#fff" }}>{s.value}</Text>
                <Text style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 2 }}>{s.label}</Text>
              </View>
            ))}
          </LinearGradient>
        </View>

        <View style={[{ marginHorizontal: 16, marginBottom: 16, flexDirection: "row", backgroundColor: "#fff", borderRadius: 20, padding: 4 }, shadow]}>
          {(["upcoming", "past"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => setActiveTab(t)}
              style={{ flex: 1, paddingVertical: 9, borderRadius: 16, alignItems: "center", backgroundColor: activeTab === t ? colors.primary : "transparent" }}
            >
              <Text style={{ fontSize: 12, fontWeight: "800", color: activeTab === t ? "#fff" : "rgba(15,23,42,0.5)", textTransform: "capitalize" }}>{t}</Text>
            </Pressable>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, gap: 10 }}>
          {shown.map((booking) => {
            const sc = statusColors[booking.status] ?? statusColors.Completed;
            return (
              <Pressable
                key={booking.id}
                onPress={() => router.push("/payments/escrow-status")}
                style={({ pressed }) => [
                  { opacity: pressed ? 0.9 : 1, flexDirection: "row", gap: 12, backgroundColor: "#fff", borderRadius: 18, padding: 10 },
                  cardShadow,
                ]}
              >
                <Image source={booking.image} style={{ width: 82, height: 82, borderRadius: 14 }} resizeMode="cover" />
                <View style={{ flex: 1, justifyContent: "center" }}>
                  <Text style={{ fontSize: 13, fontWeight: "800", color: colors.navy }} numberOfLines={1}>{booking.title}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 3 }}>
                    <MapPin size={11} color="#94A3B8" />
                    <Text style={{ fontSize: 11, color: "#64748B" }} numberOfLines={1}>{booking.location}</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                    <CalendarDays size={11} color="#94A3B8" />
                    <Text style={{ fontSize: 11, color: "#64748B" }}>{booking.date}</Text>
                    <Clock size={11} color="#94A3B8" style={{ marginLeft: 4 }} />
                    <Text style={{ fontSize: 11, color: "#64748B" }}>{booking.time}</Text>
                  </View>
                  <View style={{ marginTop: 6, alignSelf: "flex-start", backgroundColor: sc.bg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 }}>
                    <Text style={{ fontSize: 10, fontWeight: "700", color: sc.text }}>{booking.status}</Text>
                  </View>
                </View>
                <ChevronRight size={16} color="#CBD5E1" style={{ alignSelf: "center" }} />
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => router.push("/tabs/explore")}
          style={[{ marginHorizontal: 16, marginTop: 18, borderRadius: 18, overflow: "hidden" }, cardShadow]}
        >
          <LinearGradient colors={[colors.primary, "#0EA56B"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <CalendarDays size={16} color="#fff" />
            <Text style={{ fontSize: 13, fontWeight: "800", color: "#fff" }}>Book Another Viewing</Text>
          </LinearGradient>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}
