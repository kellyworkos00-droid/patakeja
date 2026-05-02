import { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { router } from "expo-router";
import {
  ArrowLeft, Bell, BellOff, CalendarDays, CheckCircle2,
  DollarSign, MessageCircle, ShieldCheck, Sparkles, Trash2,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";

type NotifType = "booking" | "message" | "listing" | "payment" | "system";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: any;
  iconBg: string;
  iconColor: string;
  accent: string;
}

const INITIAL: Notification[] = [
  {
    id: "1", type: "booking",
    title: "Viewing Reminder",
    body: "Your Kilimani apartment viewing is tomorrow at 10:00 AM. Don't forget to bring your ID.",
    time: "2 min ago", read: false,
    icon: CalendarDays, iconBg: "#EFF6FF", iconColor: "#3B82F6", accent: "#BFDBFE",
  },
  {
    id: "2", type: "message",
    title: "New Secure Message",
    body: "John replied inside your protected chat: \"Is the apartment still available?\"",
    time: "18 min ago", read: false,
    icon: MessageCircle, iconBg: "#F0FDF4", iconColor: colors.primary, accent: "#BBF7D0",
  },
  {
    id: "3", type: "listing",
    title: "Listing Verified",
    body: "A Westlands 2-bedroom matching your saved search is now verified and available.",
    time: "1 hr ago", read: false,
    icon: ShieldCheck, iconBg: "#FFF7ED", iconColor: "#F97316", accent: "#FED7AA",
  },
  {
    id: "4", type: "payment",
    title: "Escrow Payment Protected",
    body: "Your KSh 3,500 viewing fee is securely held in escrow until your visit is confirmed.",
    time: "3 hrs ago", read: true,
    icon: DollarSign, iconBg: "#F0FDF4", iconColor: colors.primary, accent: "#BBF7D0",
  },
  {
    id: "5", type: "system",
    title: "Profile 80% Complete",
    body: "Add your ID verification to unlock full trust features and get more responses.",
    time: "Yesterday", read: true,
    icon: Sparkles, iconBg: "#FDF4FF", iconColor: "#A855F7", accent: "#E9D5FF",
  },
  {
    id: "6", type: "booking",
    title: "Booking Confirmed",
    body: "Your Ngong Road Studio viewing on May 5 at 2:00 PM has been confirmed by the host.",
    time: "2 days ago", read: true,
    icon: CheckCircle2, iconBg: "#F0FDF4", iconColor: colors.primary, accent: "#BBF7D0",
  },
];

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 12,
  elevation: 3,
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const [items, setItems] = useState<Notification[]>(INITIAL);

  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const dismiss = (id: string) => setItems((prev) => prev.filter((n) => n.id !== id));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Top nav */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 20, paddingTop: 6, paddingBottom: 10,
      }}>
        <Pressable
          onPress={() => router.canGoBack() ? router.back() : router.replace("/")}
          style={[{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2E8F0",
            alignItems: "center", justifyContent: "center",
          }, shadow]}
        >
          <ArrowLeft size={20} color={colors.navy} strokeWidth={2.5} />
        </Pressable>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 17, fontWeight: "800", color: colors.navy }}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary }} />
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>{unreadCount} unread</Text>
            </View>
          )}
        </View>

        <Pressable
          onPress={markAllRead}
          disabled={unreadCount === 0}
          style={[{
            flexDirection: "row", alignItems: "center", gap: 5,
            backgroundColor: unreadCount > 0 ? "#F0FDF4" : "#F8FAFC",
            borderWidth: 1, borderColor: unreadCount > 0 ? "#BBF7D0" : "#E2E8F0",
            borderRadius: 22, paddingHorizontal: 12, paddingVertical: 9,
          }, shadow]}
        >
          <CheckCircle2 size={14} color={unreadCount > 0 ? colors.primary : "#94A3B8"} strokeWidth={2.5} />
          <Text style={{ fontSize: 12, fontWeight: "700", color: unreadCount > 0 ? colors.primary : "#94A3B8" }}>
            Mark all read
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom + 24, 32) }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero banner */}
        <View style={[{ marginBottom: 22, borderRadius: 28, overflow: "hidden" }, shadow]}>
          <Image source={images.notificationsDirection} style={{ width: "100%", height: 160 }} resizeMode="cover" />
          <LinearGradient
            colors={["transparent", "rgba(15,23,42,0.72)"]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
          <View style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: "800", color: "rgba(255,255,255,0.7)", letterSpacing: 2, marginBottom: 4 }}>PATAKEJA</Text>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", lineHeight: 22 }}>
              Every safety & booking update{"\n"}in one timeline
            </Text>
          </View>
        </View>

        {/* Unread section */}
        {items.some((n) => !n.read) && (
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 12, fontWeight: "800", color: "#94A3B8", letterSpacing: 1.2, marginBottom: 10 }}>
              NEW
            </Text>
            <View style={[{ backgroundColor: "#fff", borderRadius: 24, overflow: "hidden" }, shadow]}>
              {items.filter((n) => !n.read).map((notif, idx, arr) => {
                const Icon = notif.icon;
                return (
                  <View key={notif.id}>
                    <View style={{
                      flexDirection: "row", alignItems: "flex-start",
                      paddingHorizontal: 16, paddingVertical: 14, gap: 14,
                      backgroundColor: "#FAFFFE",
                    }}>
                      {/* Unread dot */}
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginTop: 18 }} />

                      {/* Icon */}
                      <View style={{
                        width: 48, height: 48, borderRadius: 16,
                        backgroundColor: notif.iconBg,
                        borderWidth: 1.5, borderColor: notif.accent,
                        alignItems: "center", justifyContent: "center",
                        shadowColor: notif.iconColor, shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.2, shadowRadius: 8, elevation: 3,
                      }}>
                        <Icon size={22} color={notif.iconColor} strokeWidth={2} />
                      </View>

                      {/* Content */}
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                          <Text style={{ fontSize: 14, fontWeight: "800", color: colors.navy }}>{notif.title}</Text>
                          <Text style={{ fontSize: 11, color: "#94A3B8", fontWeight: "600" }}>{notif.time}</Text>
                        </View>
                        <Text style={{ fontSize: 13, color: "#475569", lineHeight: 20, fontWeight: "500" }}>{notif.body}</Text>
                      </View>

                      {/* Dismiss */}
                      <Pressable onPress={() => dismiss(notif.id)} hitSlop={10} style={{ paddingTop: 4 }}>
                        <Trash2 size={15} color="#CBD5E1" strokeWidth={2} />
                      </Pressable>
                    </View>
                    {idx < arr.length - 1 && (
                      <View style={{ height: 1, backgroundColor: "#F1F5F9", marginLeft: 56 }} />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Earlier section */}
        {items.some((n) => n.read) && (
          <View style={{ marginTop: 18 }}>
            <Text style={{ fontSize: 12, fontWeight: "800", color: "#94A3B8", letterSpacing: 1.2, marginBottom: 10 }}>
              EARLIER
            </Text>
            <View style={[{ backgroundColor: "#fff", borderRadius: 24, overflow: "hidden" }, shadow]}>
              {items.filter((n) => n.read).map((notif, idx, arr) => {
                const Icon = notif.icon;
                return (
                  <View key={notif.id}>
                    <View style={{
                      flexDirection: "row", alignItems: "flex-start",
                      paddingHorizontal: 16, paddingVertical: 14, gap: 14,
                    }}>
                      {/* Placeholder for dot alignment */}
                      <View style={{ width: 8, marginTop: 18 }} />

                      {/* Icon (dimmed for read) */}
                      <View style={{
                        width: 48, height: 48, borderRadius: 16,
                        backgroundColor: "#F8FAFC",
                        borderWidth: 1.5, borderColor: "#E2E8F0",
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <Icon size={22} color="#94A3B8" strokeWidth={2} />
                      </View>

                      {/* Content */}
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                          <Text style={{ fontSize: 14, fontWeight: "700", color: "#64748B" }}>{notif.title}</Text>
                          <Text style={{ fontSize: 11, color: "#CBD5E1", fontWeight: "600" }}>{notif.time}</Text>
                        </View>
                        <Text style={{ fontSize: 13, color: "#94A3B8", lineHeight: 20, fontWeight: "500" }}>{notif.body}</Text>
                      </View>

                      {/* Dismiss */}
                      <Pressable onPress={() => dismiss(notif.id)} hitSlop={10} style={{ paddingTop: 4 }}>
                        <Trash2 size={15} color="#E2E8F0" strokeWidth={2} />
                      </Pressable>
                    </View>
                    {idx < arr.length - 1 && (
                      <View style={{ height: 1, backgroundColor: "#F8FAFC", marginLeft: 56 }} />
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Empty state */}
        {items.length === 0 && (
          <View style={{ alignItems: "center", paddingTop: 60, paddingBottom: 40 }}>
            <View style={[{
              width: 80, height: 80, borderRadius: 28,
              backgroundColor: "#F8FAFC", borderWidth: 1.5, borderColor: "#E2E8F0",
              alignItems: "center", justifyContent: "center", marginBottom: 16,
            }, shadow]}>
              <BellOff size={36} color="#CBD5E1" strokeWidth={1.8} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "800", color: colors.navy, marginBottom: 6 }}>All caught up!</Text>
            <Text style={{ fontSize: 14, color: "#94A3B8", textAlign: "center", lineHeight: 22 }}>
              No notifications right now.{"\n"}We'll let you know when something happens.
            </Text>
          </View>
        )}

        {/* Footer trust bar */}
        <View style={[{
          marginTop: 24, flexDirection: "row", alignItems: "center", gap: 12,
          backgroundColor: "#F0FDF4", borderRadius: 20,
          borderWidth: 1.5, borderColor: "#BBF7D0", padding: 16,
        }, { shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 3 }]}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center" }}>
            <Bell size={18} color={colors.primary} strokeWidth={2.5} />
          </View>
          <Text style={{ flex: 1, fontSize: 13, fontWeight: "600", color: "#166534", lineHeight: 20 }}>
            Notifications keep you inside PataKeja for{" "}
            <Text style={{ fontWeight: "800" }}>safer rental decisions</Text>.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
