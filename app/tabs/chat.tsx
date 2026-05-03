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
  Check,
  CalendarDays,
  Archive,
  CheckCheck,
  Edit3,
  MessageCircle,
  Lock,
} from "lucide-react-native";
import { chats, ChatThread } from "@/data/mockChats";

const FILTER_TABS = [
  { key: "all",      label: "All",      count: 12, icon: "" },
  { key: "unread",   label: "Unread",   count: 5,  icon: "" },
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

function Avatar({ thread }: { thread: ChatThread }) {
  const hasUnread = thread.unread > 0;
  return (
    <View style={{ position: "relative", width: 62, height: 62, marginRight: 14 }}>
      {thread.online && (
        <View style={{ position: "absolute", top: -2, left: -2, width: 66, height: 66, borderRadius: 33, borderWidth: 2.5, borderColor: "#16A34A" }} />
      )}
      <Image source={thread.avatar} style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#E2E8F0", margin: 1 }} />
      {hasUnread && (
        <View style={{ position: "absolute", top: -1, right: -1, minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 3, backgroundColor: "#16A34A", borderWidth: 2.5, borderColor: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "800" }}>{thread.unread > 9 ? "9+" : thread.unread}</Text>
        </View>
      )}
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
      <Avatar thread={thread} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5, flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 15.5, fontWeight: "800", color: "#0F172A", letterSpacing: -0.2 }} numberOfLines={1}>{thread.name}</Text>
            {thread.verified && <VerifiedBadge />}
          </View>
          <Text style={{ fontSize: 11.5, color: hasUnread ? "#16A34A" : "#94A3B8", fontWeight: hasUnread ? "700" : "500" }}>{thread.time}</Text>
        </View>
        <Text style={{ fontSize: 12, color: "#94A3B8", marginBottom: 4 }} numberOfLines={1}>{thread.listingSubtitle}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text
            style={{ fontSize: 13.5, color: hasUnread ? "#1E293B" : "#64748B", fontWeight: hasUnread ? "600" : "400", flex: 1, marginRight: 8, lineHeight: 18 }}
            numberOfLines={1}
          >
            {thread.lastFromMe ? <Text style={{ color: "#16A34A", fontWeight: "700" }}>You: </Text> : null}
            {thread.lastMessage}
          </Text>
          {!hasUnread && thread.lastFromMe && (
            <CheckCheck size={15} color="#16A34A" strokeWidth={2.5} />
          )}
        </View>
      </View>
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
      <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <Text style={{ fontSize: 30, fontWeight: "900", color: "#0F172A", letterSpacing: -0.8 }}>Messages</Text>
              {totalUnread > 0 && (
                <View style={{
                  backgroundColor: "#16A34A", borderRadius: 14,
                  paddingHorizontal: 9, paddingVertical: 3,
                  shadowColor: "#16A34A", shadowOpacity: 0.35,
                  shadowOffset: { width: 0, height: 3 }, shadowRadius: 6, elevation: 4,
                }}>
                  <Text style={{ color: "#FFF", fontSize: 12.5, fontWeight: "900" }}>{totalUnread}</Text>
                </View>
              )}
            </View>
            {/* Encrypted pill */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "#F0FDF4", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, alignSelf: "flex-start", borderWidth: 1, borderColor: "#DCFCE7" }}>
              <Lock size={10} color="#16A34A" fill="#16A34A" />
              <Text style={{ fontSize: 11.5, color: "#16A34A", fontWeight: "700", letterSpacing: 0.2 }}>End-to-end encrypted</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
            <Pressable style={({ pressed }) => ({
              width: 42, height: 42, borderRadius: 21,
              backgroundColor: pressed ? "#F1F5F9" : "#F8FAFC",
              borderWidth: 1, borderColor: "#E2E8F0",
              alignItems: "center", justifyContent: "center",
            })}>
              <Search size={18} color="#334155" strokeWidth={2} />
            </Pressable>
            <Pressable style={({ pressed }) => ({
              width: 42, height: 42, borderRadius: 21,
              backgroundColor: pressed ? "#F1F5F9" : "#F8FAFC",
              borderWidth: 1, borderColor: "#E2E8F0",
              alignItems: "center", justifyContent: "center",
            })}>
              <Edit3 size={18} color="#334155" strokeWidth={2} />
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
          filteredChats.map((thread, i) => (
            <React.Fragment key={thread.id}>
              <ChatRow thread={thread} onPress={() => router.push(`/chat/${thread.id}` as any)} />
              {i < filteredChats.length - 1 && (
                <View style={{ height: 1, backgroundColor: "#F1F5F9", marginLeft: 94 }} />
              )}
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
