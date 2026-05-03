import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Search,
  Shield,
  ChevronRight,
  Check,
  CalendarDays,
  Archive,
  CheckCheck,
  Edit3,
  MessageCircle,
} from "lucide-react-native";
import { chats, ChatThread } from "@/data/mockChats";

const FILTER_TABS = [
  { key: "all", label: "All Chats", count: 12, icon: "" },
  { key: "unread", label: "Unread", count: 5, icon: "" },
  { key: "bookings", label: "Bookings", icon: "calendar" },
  { key: "archive", label: "Archive", icon: "archive" },
];

function FilterTabIcon({ icon, active }: { icon: string; active: boolean }) {
  const col = active ? "#FFFFFF" : "#64748B";
  if (icon === "calendar") return <CalendarDays size={15} color={col} strokeWidth={2} />;
  if (icon === "archive") return <Archive size={15} color={col} strokeWidth={2} />;
  return null;
}

function VerifiedBadge() {
  return (
    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" }}>
      <Check color="white" size={10} strokeWidth={3} />
    </View>
  );
}

function ChatRow({ thread, onPress }: { thread: ChatThread; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.82 : 1 }]}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingVertical: 13 }}>
        <View style={{ position: "relative", marginRight: 13 }}>
          <Image source={thread.avatar} style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: "#E2E8F0" }} />
          {thread.online && (
            <View style={{ position: "absolute", bottom: 1, left: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: "#16A34A", borderWidth: 2.5, borderColor: "#FFFFFF" }} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, flex: 1, marginRight: 8 }}>
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#0F172A" }} numberOfLines={1}>{thread.name}</Text>
              {thread.verified && <VerifiedBadge />}
            </View>
            <Text style={{ fontSize: 12, color: "#94A3B8", fontWeight: "500" }}>{thread.time}</Text>
          </View>
          <Text style={{ fontSize: 12.5, color: "#64748B", marginBottom: 3 }} numberOfLines={1}>{thread.listingSubtitle}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text
              style={{ fontSize: 13.5, color: thread.unread > 0 ? "#334155" : "#64748B", fontWeight: thread.unread > 0 ? "600" : "400", flex: 1, marginRight: 8 }}
              numberOfLines={1}
            >
              {thread.lastFromMe ? <Text style={{ color: "#16A34A", fontWeight: "600" }}>You: </Text> : null}
              {thread.lastMessage}
            </Text>
            {thread.unread > 0 ? (
              <View style={{ minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 5, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#FFFFFF", fontSize: 11.5, fontWeight: "700" }}>{thread.unread}</Text>
              </View>
            ) : thread.lastFromMe ? (
              <CheckCheck size={16} color="#16A34A" strokeWidth={2.5} />
            ) : null}
          </View>
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: "#F1F5F9", marginLeft: 91 }} />
    </Pressable>
  );
}

export default function ChatListScreen() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredChats =
    activeFilter === "unread" ? chats.filter((c) => c.unread > 0) :
    activeFilter === "bookings" || activeFilter === "archive" ? [] :
    chats;

  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>

      {/* ── Header ── */}
      <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 12, backgroundColor: "#FFFFFF" }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 28, fontWeight: "900", color: "#0F172A", letterSpacing: -0.5 }}>Messages</Text>
              {totalUnread > 0 && (
                <View style={{ backgroundColor: "#16A34A", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>{totalUnread}</Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 }}>
              <Shield size={11} color="#16A34A" fill="#16A34A" />
              <Text style={{ fontSize: 12.5, color: "#64748B" }}>End-to-end encrypted</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#F4F8FB", alignItems: "center", justifyContent: "center" }}>
              <Search size={18} color="#0F172A" strokeWidth={2} />
            </Pressable>
            <Pressable style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#F4F8FB", alignItems: "center", justifyContent: "center" }}>
              <Edit3 size={18} color="#0F172A" strokeWidth={2} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── Filter Tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 10, gap: 8 }}
      >
        {FILTER_TABS.map((tab) => {
          const active = activeFilter === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveFilter(tab.key)}
              style={{
                flexDirection: "row", alignItems: "center", gap: 6,
                paddingHorizontal: 14, height: 38, borderRadius: 19,
                backgroundColor: active ? "#0F172A" : "#F4F8FB",
              }}
            >
              <FilterTabIcon icon={tab.icon} active={active} />
              <Text style={{ fontSize: 13.5, fontWeight: "700", color: active ? "#FFFFFF" : "#475569" }}>{tab.label}</Text>
              {tab.count !== undefined && tab.count > 0 && (
                <View style={{ minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 4, backgroundColor: active ? "#16A34A" : "#E2E8F0", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ color: active ? "#FFFFFF" : "#475569", fontSize: 10.5, fontWeight: "800" }}>{tab.count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Security Card ── */}
      <View style={{ marginHorizontal: 20, marginBottom: 8, padding: 14, backgroundColor: "#F0FDF4", borderRadius: 16, borderWidth: 1, borderColor: "#BBF7D0", flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Shield size={19} color="#16A34A" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#0F172A" }}>Your conversations are secure</Text>
          <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2, lineHeight: 17 }}>Phone numbers are hidden. Payments protected.</Text>
        </View>
        <Pressable style={{ flexDirection: "row", alignItems: "center", gap: 1, flexShrink: 0 }}>
          <Text style={{ fontSize: 12.5, color: "#16A34A", fontWeight: "600" }}>Learn more</Text>
          <ChevronRight size={13} color="#16A34A" strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* ── Chat List ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {filteredChats.length === 0 ? (
          <View style={{ alignItems: "center", paddingTop: 60, gap: 12 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: "#F4F8FB", alignItems: "center", justifyContent: "center" }}>
              <MessageCircle size={28} color="#94A3B8" strokeWidth={1.5} />
            </View>
            <Text style={{ fontSize: 15, color: "#94A3B8", fontWeight: "600" }}>No chats here yet</Text>
          </View>
        ) : (
          filteredChats.map((thread) => (
            <ChatRow key={thread.id} thread={thread} onPress={() => router.push(`/chat/${thread.id}` as any)} />
          ))
        )}
      </ScrollView>

      {/* ── FAB ── */}
      <Pressable
        style={({ pressed }) => ({
          position: "absolute", bottom: 90, right: 20,
          width: 54, height: 54, borderRadius: 27,
          backgroundColor: pressed ? "#15803D" : "#16A34A",
          alignItems: "center", justifyContent: "center",
          shadowColor: "#16A34A", shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35, shadowRadius: 14, elevation: 8,
        })}
      >
        <Edit3 size={22} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>
    </SafeAreaView>
  );
}
