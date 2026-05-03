import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Pressable,
  Image,
  useWindowDimensions,
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
  { key: "all",      label: "All",       count: 12, icon: "" },
  { key: "unread",   label: "Unread",    count: 5,  icon: "" },
  { key: "bookings", label: "Bookings",  count: 0,  icon: "calendar" },
  { key: "archive",  label: "Archive",   count: 0,  icon: "archive" },
];

function FilterTabIcon({ icon, active }: { icon: string; active: boolean }) {
  const col = active ? "#FFFFFF" : "#0F172A";
  if (icon === "calendar") return <CalendarDays size={12} color={col} strokeWidth={2} />;
  if (icon === "archive") return <Archive size={12} color={col} strokeWidth={2} />;
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
  const { width: screenWidth } = useWindowDimensions();
  // rail outer padding 6*2=12, inner padding 3*2=6, 3 gaps of 2px = 6 → subtract all from screen
  const tabWidth = Math.floor((screenWidth - 12 - 6 - 6) / 4);

  const scrollY = useRef(new Animated.Value(0)).current;

  // Header title + subtitle collapse upward on scroll
  const titleOpacity = scrollY.interpolate({ inputRange: [0, 60], outputRange: [1, 0], extrapolate: "clamp" });
  const titleHeight = scrollY.interpolate({ inputRange: [0, 60], outputRange: [62, 0], extrapolate: "clamp" });

  // Search bar lifts slightly as content scrolls under it
  const searchBarElevation = scrollY.interpolate({ inputRange: [0, 60], outputRange: [0, 8], extrapolate: "clamp" });
  const searchBarShadow = scrollY.interpolate({ inputRange: [0, 60], outputRange: [0.06, 0.2], extrapolate: "clamp" });

  const filteredChats =
    activeFilter === "unread" ? chats.filter((c) => c.unread > 0) :
    activeFilter === "bookings" || activeFilter === "archive" ? [] :
    chats;

  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F7F9FC" }} edges={["top"]}>

      {/* ── Collapsing Title ── */}
      <Animated.View style={{
        overflow: "hidden",
        height: titleHeight,
        opacity: titleOpacity,
        paddingHorizontal: 20,
        paddingTop: 14,
        justifyContent: "flex-start",
      }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <Text style={{ fontSize: 30, fontWeight: "900", color: "#0F172A", letterSpacing: -0.6 }}>Chats</Text>
          {totalUnread > 0 && (
            <View style={{ backgroundColor: "#16A34A", borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 }}>
              <Text style={{ color: "#fff", fontSize: 12, fontWeight: "800" }}>{totalUnread}</Text>
            </View>
          )}
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={{ fontSize: 13, color: "#667085" }}>Secure conversations, safe and private.</Text>
          <Shield size={13} color="#16A34A" fill="#16A34A" />
        </View>
      </Animated.View>

      {/* ── Premium Floating Search Bar (always visible, sticks as title collapses) ── */}
      <Animated.View style={{
        marginHorizontal: 14,
        marginBottom: 12,
        borderRadius: 26,
        backgroundColor: "#FFFFFF",
        flexDirection: "row",
        alignItems: "center",
        height: 54,
        paddingHorizontal: 6,
        gap: 0,
        shadowColor: "#0B1D45",
        shadowOpacity: searchBarShadow,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 28,
        elevation: searchBarElevation,
        borderWidth: 1,
        borderColor: "#EEF2F6",
      }}>
        {/* Green search bubble */}
        <View style={{
          width: 42, height: 42, borderRadius: 21,
          backgroundColor: "#16A34A",
          alignItems: "center", justifyContent: "center",
          shadowColor: "#16A34A", shadowOpacity: 0.35,
          shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 4,
        }}>
          <Search size={19} color="#FFFFFF" strokeWidth={2.5} />
        </View>

        {/* Text area */}
        <View style={{ flex: 1, paddingHorizontal: 12 }}>
          <Text style={{ fontSize: 14.5, fontWeight: "600", color: "#0F172A", letterSpacing: -0.2 }}>Search conversations</Text>
          <Text style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>Names, messages, listings...</Text>
        </View>

        {/* Right filter button */}
        <View style={{
          width: 42, height: 42, borderRadius: 21,
          backgroundColor: "#F1F5F9",
          alignItems: "center", justifyContent: "center",
        }}>
          <SlidersHorizontal size={17} color="#0B1D45" strokeWidth={2} />
          <View style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: "#16A34A", borderWidth: 2, borderColor: "#F1F5F9" }} />
        </View>
      </Animated.View>

      {/* ── Filter Tabs ── */}
      <View style={{ paddingHorizontal: 6, paddingBottom: 10 }}>
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          paddingHorizontal: 3,
          paddingVertical: 4,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
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
                  width: tabWidth,
                  height: 33,
                  borderRadius: 17,
                  backgroundColor: active ? "#0B1D45" : "#FFFFFF",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  overflow: "hidden",
                }}
              >
                <FilterTabIcon icon={tab.icon} active={active} />
                <Text allowFontScaling={false} style={{ fontSize: 9.5, fontWeight: "700", color: active ? "#FFFFFF" : "#0F172A" }} numberOfLines={1}>
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <View style={{
                    minWidth: 14,
                    height: 14,
                    borderRadius: 7,
                    paddingHorizontal: 2,
                    backgroundColor: active ? "#71C949" : "#16A34A",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Text allowFontScaling={false} style={{ color: "#FFFFFF", fontSize: 8, fontWeight: "800" }}>{tab.count}</Text>
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
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, backgroundColor: "#F7F9FC" }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
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
      </Animated.ScrollView>

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
