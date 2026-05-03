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
  SlidersHorizontal,
  Check,
  CalendarDays,
  Archive,
  CheckCheck,
  SquarePen,
  MessageCircle,
} from "lucide-react-native";
import { chats, ChatThread } from "@/data/mockChats";

const FILTER_TABS = [
  { key: "all",      label: "All Chats", count: 12, icon: "" },
  { key: "unread",   label: "Unread",    count: 5,  icon: "" },
  { key: "bookings", label: "Bookings",  count: 0,  icon: "calendar" },
  { key: "archive",  label: "Archive",   count: 0,  icon: "archive" },
];

function FilterTabIcon({ icon, active }: { icon: string; active: boolean }) {
  const col = active ? "#FFFFFF" : "#0F172A";
  if (icon === "calendar") return <CalendarDays size={16} color={col} strokeWidth={2} />;
  if (icon === "archive") return <Archive size={16} color={col} strokeWidth={2} />;
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
        marginHorizontal: 14,
        marginTop: 10,
        borderRadius: 18,
        paddingHorizontal: 14,
        paddingVertical: 12,
        backgroundColor: pressed ? "#F8FAFC" : "#FFFFFF",
        shadowColor: "#0F172A",
        shadowOpacity: 0.04,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 2,
      })}
    >
      {/* Avatar with online dot */}
      <View style={{ position: "relative", marginRight: 14 }}>
        <Image source={thread.avatar} style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: "#E2E8F0" }} />
        {thread.online && (
          <View style={{ position: "absolute", bottom: 1, left: 1, width: 13, height: 13, borderRadius: 7, backgroundColor: "#16A34A", borderWidth: 2.5, borderColor: "#FFFFFF" }} />
        )}
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 7, flex: 1, marginRight: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#0F172A" }} numberOfLines={1}>{thread.name}</Text>
            {thread.verified && <VerifiedBadge />}
          </View>
          <Text style={{ fontSize: 11.5, color: "#98A2B3", fontWeight: "500" }}>{thread.time}</Text>
        </View>
        <Text style={{ fontSize: 11.5, color: "#667085", marginBottom: 5 }} numberOfLines={1}>{thread.listingSubtitle}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <Text
            style={{ fontSize: 13.5, color: "#0F172A", fontWeight: "500", flex: 1, marginRight: 8 }}
            numberOfLines={1}
          >
            {thread.lastFromMe ? <Text style={{ color: "#16A34A", fontWeight: "600" }}>You: </Text> : null}
            {thread.lastMessage}
          </Text>
          {hasUnread ? (
            <View style={{ minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 5, backgroundColor: "#16A34A", alignItems: "center", justifyContent: "center" }}>
              <Text style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "700" }}>{thread.unread}</Text>
            </View>
          ) : thread.lastFromMe ? (
            <CheckCheck size={21} color="#16A34A" strokeWidth={2.2} />
          ) : null}
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9FC" }} edges={["top"]}>

      {/* ── Header ── */}
      <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text style={{ fontSize: 30, fontWeight: "900", color: "#0F172A", letterSpacing: -0.6 }}>Chats</Text>
              {totalUnread > 0 && (
                <View style={{ backgroundColor: "#16A34A", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>{totalUnread}</Text>
                </View>
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
              <Text style={{ fontSize: 13, color: "#667085" }}>Secure conversations, safe and private.</Text>
              <Shield size={13} color="#16A34A" fill="#16A34A" />
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable style={({ pressed }) => ({
              width: 46, height: 46, borderRadius: 23,
              backgroundColor: pressed ? "#EEF2F6" : "#FFFFFF",
              alignItems: "center", justifyContent: "center",
              shadowColor: "#0F172A", shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 4,
            })}>
              <Search size={18} color="#0F172A" strokeWidth={2} />
            </Pressable>
            <Pressable style={({ pressed }) => ({
              width: 46, height: 46, borderRadius: 23,
              backgroundColor: pressed ? "#EEF2F6" : "#FFFFFF",
              alignItems: "center", justifyContent: "center",
              shadowColor: "#0F172A", shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 4,
            })}>
              <SlidersHorizontal size={17} color="#0F172A" strokeWidth={2} />
              <View style={{ position: "absolute", top: 8, right: 9, width: 7, height: 7, borderRadius: 4, backgroundColor: "#16A34A" }} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* ── Filter Tabs ── */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 12 }}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 6,
          paddingHorizontal: 8,
          paddingVertical: 8,
          backgroundColor: "#FFFFFF",
          borderRadius: 18,
          shadowColor: "#0F172A",
          shadowOpacity: 0.07,
          shadowOffset: { width: 0, height: 8 },
          shadowRadius: 18,
          elevation: 4,
        }}>
          {FILTER_TABS.map((tab) => {
            const active = activeFilter === tab.key;
            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveFilter(tab.key)}
                style={{
                  flex: 1,
                  minWidth: 0,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: active ? "#0B1D45" : "#FFFFFF",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  paddingHorizontal: 5,
                }}
              >
                <FilterTabIcon icon={tab.icon} active={active} />
                <Text style={{ fontSize: 11.5, fontWeight: "700", color: active ? "#FFFFFF" : "#0F172A" }} numberOfLines={1}>
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <View style={{
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    paddingHorizontal: 4,
                    backgroundColor: active ? "#71C949" : "#16A34A",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "800" }}>{tab.count}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ── Divider ── */}
      <View style={{ height: 1, backgroundColor: "#EEF2F6", marginHorizontal: 14 }} />

      {/* ── Chat List ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, backgroundColor: "#F7F9FC" }}>
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
            </React.Fragment>
          ))
        )}
      </ScrollView>

      {/* ── FAB ── */}
      <Pressable
        style={({ pressed }) => ({
          position: "absolute", bottom: 92, right: 20,
          width: 64, height: 64, borderRadius: 32,
          backgroundColor: pressed ? "#15803D" : "#16A34A",
          alignItems: "center", justifyContent: "center",
          shadowColor: "#16A34A", shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35, shadowRadius: 18, elevation: 12,
        })}
      >
        <SquarePen size={28} color="#FFFFFF" strokeWidth={2.2} />
      </Pressable>
    </SafeAreaView>
  );
}
