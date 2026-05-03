import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Search,
  SlidersHorizontal,
  Shield,
  ChevronRight,
  Check,
  CalendarDays,
  Archive,
  CheckCheck,
  Edit,
} from "lucide-react-native";
import { chats, ChatThread } from "@/data/mockChats";
import { colors } from "@/constants/colors";

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
    <View
      style={{
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: "#16A34A",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Check color="white" size={10} strokeWidth={3} />
    </View>
  );
}

function ChatRow({
  thread,
  onPress,
}: {
  thread: ChatThread;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.82 : 1 }]}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 14,
        }}
      >
        {/* Avatar with online dot */}
        <View style={{ position: "relative", marginRight: 12 }}>
          <Image
            source={thread.avatar}
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: "#E2E8F0",
            }}
          />
          {thread.online && (
            <View
              style={{
                position: "absolute",
                bottom: 1,
                left: 1,
                width: 14,
                height: 14,
                borderRadius: 7,
                backgroundColor: "#16A34A",
                borderWidth: 2.5,
                borderColor: "#FFFFFF",
              }}
            />
          )}
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          {/* Name row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                flex: 1,
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#0F172A",
                }}
                numberOfLines={1}
              >
                {thread.name}
              </Text>
              {thread.verified && <VerifiedBadge />}
            </View>
            <Text style={{ fontSize: 12.5, color: "#94A3B8", fontWeight: "500" }}>
              {thread.time}
            </Text>
          </View>

          {/* Listing subtitle */}
          <Text
            style={{ fontSize: 13, color: "#64748B", marginBottom: 3 }}
            numberOfLines={1}
          >
            {thread.listingSubtitle}
          </Text>

          {/* Last message + badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 13.5,
                color: thread.unread > 0 ? "#334155" : "#64748B",
                fontWeight: thread.unread > 0 ? "600" : "400",
                flex: 1,
                marginRight: 8,
              }}
              numberOfLines={1}
            >
              {thread.lastFromMe ? (
                <Text style={{ color: "#16A34A", fontWeight: "600" }}>
                  You:{" "}
                </Text>
              ) : null}
              {thread.lastMessage}
            </Text>
            {thread.unread > 0 ? (
              <View
                style={{
                  minWidth: 22,
                  height: 22,
                  borderRadius: 11,
                  paddingHorizontal: 5,
                  backgroundColor: "#16A34A",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ color: "#FFFFFF", fontSize: 11.5, fontWeight: "700" }}
                >
                  {thread.unread}
                </Text>
              </View>
            ) : thread.lastFromMe ? (
              <CheckCheck size={16} color="#16A34A" strokeWidth={2.5} />
            ) : null}
          </View>
        </View>
      </View>

      {/* Divider */}
      <View
        style={{
          height: 1,
          backgroundColor: "#F1F5F9",
          marginLeft: 92,
          marginRight: 0,
        }}
      />
    </Pressable>
  );
}

export default function ChatListScreen() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredChats =
    activeFilter === "unread"
      ? chats.filter((c) => c.unread > 0)
      : activeFilter === "bookings" || activeFilter === "archive"
      ? []
      : chats;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#F4F8FB" }}
      edges={["top"]}
    >
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "900",
                color: "#0F172A",
                letterSpacing: -0.5,
              }}
            >
              Chats
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                marginTop: 3,
              }}
            >
              <Text style={{ fontSize: 13.5, color: "#64748B" }}>
                Secure conversations, safe and private.
              </Text>
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  backgroundColor: "#16A34A",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Shield size={10} color="white" fill="white" />
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
            <Pressable
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#EDF2F7",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#0F172A",
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <Search size={18} color="#0F172A" strokeWidth={2} />
            </Pressable>
            <Pressable
              style={{
                position: "relative",
                width: 42,
                height: 42,
                borderRadius: 21,
                backgroundColor: "#FFFFFF",
                borderWidth: 1,
                borderColor: "#EDF2F7",
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#0F172A",
                shadowOpacity: 0.06,
                shadowRadius: 6,
                elevation: 2,
              }}
            >
              <SlidersHorizontal size={18} color="#0F172A" strokeWidth={2} />
              <View
                style={{
                  position: "absolute",
                  top: 9,
                  right: 9,
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: "#16A34A",
                  borderWidth: 1.5,
                  borderColor: "#FFFFFF",
                }}
              />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 4,
          gap: 8,
        }}
      >
        {FILTER_TABS.map((tab) => {
          const active = activeFilter === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveFilter(tab.key)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                paddingHorizontal: 14,
                height: 42,
                borderRadius: 21,
                backgroundColor: active ? "#0F172A" : "#FFFFFF",
                borderWidth: 1,
                borderColor: active ? "#0F172A" : "#EDF2F7",
                shadowColor: "#0F172A",
                shadowOpacity: active ? 0 : 0.05,
                shadowRadius: 4,
                elevation: active ? 0 : 1,
              }}
            >
              <FilterTabIcon icon={tab.icon} active={active} />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: active ? "#FFFFFF" : "#475569",
                }}
              >
                {tab.label}
              </Text>
              {tab.count !== undefined && (
                <View
                  style={{
                    minWidth: 22,
                    height: 22,
                    borderRadius: 11,
                    paddingHorizontal: 5,
                    backgroundColor: "#16A34A",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: "#FFFFFF", fontSize: 11, fontWeight: "800" }}
                  >
                    {tab.count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Security Card */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 14,
            padding: 16,
            backgroundColor: "#FFFFFF",
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "#EDF2F7",
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            shadowColor: "#0F172A",
            shadowOpacity: 0.04,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: "#DCFCE7",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Shield size={22} color="#16A34A" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#0F172A",
                marginBottom: 3,
              }}
            >
              Your conversations are secure
            </Text>
            <Text style={{ fontSize: 12.5, color: "#64748B", lineHeight: 18 }}>
              Phone numbers are hidden. Payments and bookings are protected.
            </Text>
          </View>
          <Pressable
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              flexShrink: 0,
            }}
          >
            <Text style={{ fontSize: 13, color: "#16A34A", fontWeight: "600" }}>
              Learn more
            </Text>
            <ChevronRight size={14} color="#16A34A" strokeWidth={2.5} />
          </Pressable>
        </View>

        {/* Chat List */}
        <View style={{ marginTop: 8 }}>
          {filteredChats.length === 0 ? (
            <View style={{ alignItems: "center", paddingTop: 60 }}>
              <Text style={{ fontSize: 15, color: "#94A3B8" }}>
                No chats here yet.
              </Text>
            </View>
          ) : (
            filteredChats.map((thread) => (
              <ChatRow
                key={thread.id}
                thread={thread}
                onPress={() => router.push(`/chat/${thread.id}` as any)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* FAB Compose */}
      <Pressable
        style={{
          position: "absolute",
          bottom: 90,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: "#16A34A",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#16A34A",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.35,
          shadowRadius: 14,
          elevation: 8,
        }}
      >
        <Edit size={22} color="#FFFFFF" strokeWidth={2.5} />
      </Pressable>
    </SafeAreaView>
  );
}
