import React, { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Search,
  Shield,
  X,
  Check,
  CalendarDays,
  Archive,
  CheckCheck,
  Edit3,
  MessageCircle,
} from "lucide-react-native";
import { chats, ChatThread } from "@/data/mockChats";

const FILTER_TABS = [
  { key: "all",      label: "All Chats", count: 12, icon: "" },
  { key: "unread",   label: "Unread",    count: 5,  icon: "" },
  { key: "bookings", label: "Bookings", count: 0,  icon: "calendar" },
  { key: "archive",  label: "Archive",  count: 0,  icon: "archive" },
];

function FilterTabIcon({ icon, active }: { icon: string; active: boolean }) {
  const col = active ? "#FFFFFF" : "#64748B";
  if (icon === "calendar") return <CalendarDays size={15} color={col} strokeWidth={2} />;
  if (icon === "archive") return <Archive size={15} color={col} strokeWidth={2} />;
  return null;
}

function VerifiedBadge() {
  return (
    <View style={{ width: 15, height: 15, borderRadius: 8, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" }}>
      <Check color="white" size={9} strokeWidth={3} />
    </View>
  );
}

function ChatRow({ thread, onPress }: { thread: ChatThread; onPress: () => void }) {
  const hasUnread = thread.unread > 0;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 13,
        backgroundColor: pressed ? "#F8FAFC" : "#FFFFFF",
      })}
    >
      {/* Avatar with online dot */}
      <View style={{ position: "relative", marginRight: 13 }}>
        <Image source={thread.avatar} style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: "#E2E8F0" }} />
        {thread.online && (
          <View style={{ position: "absolute", bottom: 1, left: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: "#16A34A", borderWidth: 2.5, borderColor: "#FFFFFF" }} />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#0F172A" }} numberOfLines={1}>{thread.name}</Text>
            {thread.verified && <VerifiedBadge />}
          </View>
          <Text style={{ fontSize: 12, color: "#94A3B8", fontWeight: "500" }}>{thread.time}</Text>
        </View>
        <Text style={{ fontSize: 12.5, color: "#64748B", marginBottom: 3 }} numberOfLines={1}>{thread.listingSubtitle}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text
            style={{ fontSize: 13.5, color: hasUnread ? "#334155" : "#64748B", fontWeight: hasUnread ? "600" : "400", flex: 1, marginRight: 8 }}
            numberOfLines={1}
          >
            {thread.lastFromMe ? <Text style={{ color: "#16A34A", fontWeight: "600" }}>You: </Text> : null}
            {thread.lastMessage}
          </Text>
          {hasUnread ? (
            <View style={{ minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 5, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#FFFFFF", fontSize: 11.5, fontWeight: "700" }}>{thread.unread}</Text>
            </View>
          ) : thread.lastFromMe ? (
            <CheckCheck size={16} color="#16A34A" strokeWidth={2.5} />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

function SecurityBanner() {
  const [visible, setVisible] = useState(true);
  const opacity = useRef(new Animated.Value(1)).current;
  const maxHeight = useRef(new Animated.Value(60)).current;

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: false }),
      Animated.timing(maxHeight, { toValue: 0, duration: 300, useNativeDriver: false }),
    ]).start(() => setVisible(false));
  };

  if (!visible) return null;
  return (
    <Animated.View style={{ opacity, maxHeight, overflow: "hidden", marginHorizontal: 20, marginBottom: 10 }}>
      <View style={{
        flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: "#F8FAFC", borderRadius: 12,
        paddingHorizontal: 14, paddingVertical: 11,
        borderLeftWidth: 3, borderLeftColor: "#16A34A",
      }}>
        <Shield size={15} color="#16A34A" strokeWidth={2} />
        <Text style={{ flex: 1, fontSize: 12.5, color: "#475569", fontWeight: "500" }}>
          Conversations & payments are fully protected
        </Text>
        <Pressable onPress={dismiss} hitSlop={10}>
          <X size={15} color="#94A3B8" strokeWidth={2.5} />
        </Pressable>
      </View>
    </Animated.View>
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
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: "#16A34A" }} />
              <Text style={{ fontSize: 12.5, color: "#64748B" }}>End-to-end encrypted</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable style={({ pressed }) => ({
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: pressed ? "#F1F5F9" : "#F4F8FB",
              alignItems: "center", justifyContent: "center",
            })}>
              <Search size={18} color="#0F172A" strokeWidth={2} />
            </Pressable>
            <Pressable style={({ pressed }) => ({
              width: 40, height: 40, borderRadius: 20,
              backgroundColor: pressed ? "#F1F5F9" : "#F4F8FB",
              alignItems: "center", justifyContent: "center",
            })}>
              <Edit3 size={18} color="#0F172A" strokeWidth={2} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── Filter Tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12, gap: 8 }}
      >
        {FILTER_TABS.map((tab) => {
          const active = activeFilter === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveFilter(tab.key)}
              style={{
                flexDirection: "row", alignItems: "center", gap: 6,
                paddingHorizontal: 16, height: 36, borderRadius: 18,
                backgroundColor: active ? "#0F172A" : "#F4F8FB",
                borderWidth: 1,
                borderColor: active ? "#0F172A" : "#E2E8F0",
                shadowColor: active ? "#0F172A" : "transparent",
                shadowOpacity: active ? 0.18 : 0,
                shadowOffset: { width: 0, height: 4 },
                shadowRadius: 8,
                elevation: active ? 4 : 0,
              }}
            >
              <FilterTabIcon icon={tab.icon} active={active} />
              <Text style={{ fontSize: 13, fontWeight: "700", color: active ? "#FFFFFF" : "#64748B", letterSpacing: 0.1 }}>
                {tab.label}
              </Text>
              {tab.count > 0 && (
                <View style={{
                  minWidth: 18, height: 18, borderRadius: 9, paddingHorizontal: 3,
                  backgroundColor: active ? "#16A34A" : "#E2E8F0",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <Text style={{ color: active ? "#FFF" : "#64748B", fontSize: 10, fontWeight: "800" }}>{tab.count}</Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Security Banner ── */}
      <SecurityBanner />

      {/* ── Divider ── */}
      <View style={{ height: 1, backgroundColor: "#F1F5F9" }} />

      {/* ── Chat List ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {filteredChats.length === 0 ? (
          <View style={{ alignItems: "center", paddingTop: 80, gap: 14 }}>
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: "#F4F8FB", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#E2E8F0" }}>
              <MessageCircle size={30} color="#94A3B8" strokeWidth={1.5} />
            </View>
            <Text style={{ fontSize: 16, color: "#94A3B8", fontWeight: "700" }}>No conversations yet</Text>
            <Text style={{ fontSize: 13.5, color: "#CBD5E1", textAlign: "center", paddingHorizontal: 40, lineHeight: 20 }}>
              Browse listings and tap "Chat" to start a conversation.
            </Text>
          </View>
        ) : (
          filteredChats.map((thread) => (
            <React.Fragment key={thread.id}>
              <ChatRow thread={thread} onPress={() => router.push(`/chat/${thread.id}` as any)} />
              <View style={{ height: 1, backgroundColor: "#F1F5F9", marginLeft: 91 }} />
            </React.Fragment>
          ))
        )}
      </ScrollView>

      {/* ── FAB ── */}
      <Pressable
        style={({ pressed }) => ({
          position: "absolute", bottom: 92, right: 20,
          width: 56, height: 56, borderRadius: 28,
          backgroundColor: pressed ? "#15803D" : "#16A34A",
          alignItems: "center", justifyContent: "center",
          shadowColor: "#16A34A", shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
        })}
      >
        <Edit3 size={22} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>
    </SafeAreaView>
  );
}
