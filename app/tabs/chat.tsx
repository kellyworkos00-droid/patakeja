import { ElementType, useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { router } from "expo-router";
import { Archive, CalendarDays, MessageCircle, Search, ShieldCheck } from "lucide-react-native";
import { chats } from "@/data/mockChats";
import { colors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.07,
  shadowRadius: 10,
  elevation: 3,
};

const tabs: Array<{ label: string; icon: ElementType; count?: string }> = [
  { label: "All", icon: MessageCircle, count: "12" },
  { label: "Bookings", icon: CalendarDays },
  { label: "Archive", icon: Archive },
];

export default function ChatListScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 10, paddingBottom: 8 }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: "800", color: colors.navy }}>Messages</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 1 }}>
              <ShieldCheck size={12} color={colors.primary} />
              <Text style={{ fontSize: 11, color: "#64748B", fontWeight: "500" }}>Secure conversations</Text>
            </View>
          </View>
          <Pressable style={[{ width: 36, height: 36, borderRadius: 18, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }, shadow]}>
            <Search size={16} color={colors.navy} />
          </Pressable>
        </View>

        <View style={[{ marginHorizontal: 16, marginBottom: 14, flexDirection: "row", backgroundColor: "#fff", borderRadius: 20, padding: 4 }, shadow]}>
          {tabs.map((tab, i) => {
            const Icon = tab.icon;
            const active = activeTab === i;
            return (
              <Pressable
                key={tab.label}
                onPress={() => setActiveTab(i)}
                style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5, paddingVertical: 9, borderRadius: 16, backgroundColor: active ? colors.navy : "transparent" }}
              >
                <Icon size={14} color={active ? "#fff" : "rgba(15,23,42,0.5)"} />
                <Text style={{ fontSize: 12, fontWeight: "700", color: active ? "#fff" : "rgba(15,23,42,0.5)" }}>{tab.label}</Text>
                {tab.count && (
                  <View style={{ height: 18, minWidth: 18, backgroundColor: active ? "rgba(255,255,255,0.25)" : colors.primary, borderRadius: 9, paddingHorizontal: 4, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ fontSize: 10, fontWeight: "800", color: "#fff" }}>{tab.count}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={{ marginHorizontal: 16, marginBottom: 14, backgroundColor: "#EEF9F3", borderRadius: 14, paddingHorizontal: 12, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: "#BFE7D1" }}>
          <ShieldCheck size={16} color={colors.primary} />
          <Text style={{ flex: 1, fontSize: 11, fontWeight: "600", color: "#065F46", lineHeight: 16 }}>
            Never pay outside the app. All payments secured by PataKeja escrow.
          </Text>
        </View>

        <View style={[{ marginHorizontal: 16, backgroundColor: "#fff", borderRadius: 22, overflow: "hidden" }, shadow]}>
          {chats.map((chat, i) => (
            <Pressable
              key={chat.id}
              onPress={() => router.push(`/chat/${chat.id}`)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.85 : 1,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderBottomWidth: i < chats.length - 1 ? 1 : 0,
                borderBottomColor: "#F1F5F9",
              })}
            >
              <View style={{ position: "relative" }}>
                <Image source={chat.avatar} style={{ width: 52, height: 52, borderRadius: 26 }} resizeMode="cover" />
                <View style={{ position: "absolute", bottom: 0, right: 0, width: 13, height: 13, borderRadius: 6.5, backgroundColor: colors.primary, borderWidth: 2, borderColor: "#fff" }} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                    <Text style={{ fontSize: 14, fontWeight: "800", color: colors.navy }}>{chat.name}</Text>
                    {chat.verified && <ShieldCheck size={13} color={colors.primary} />}
                  </View>
                  <Text style={{ fontSize: 11, color: "#94A3B8", fontWeight: "500" }}>{chat.time}</Text>
                </View>
                <Text style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }} numberOfLines={1}>{chat.listingTitle}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 3 }}>
                  <Text style={{ flex: 1, fontSize: 13, color: chat.unread ? colors.navy : "#64748B", fontWeight: chat.unread ? "600" : "400" }} numberOfLines={1}>{chat.lastMessage}</Text>
                  {chat.unread ? (
                    <View style={{ height: 22, minWidth: 22, backgroundColor: colors.primary, borderRadius: 11, paddingHorizontal: 5, alignItems: "center", justifyContent: "center", marginLeft: 8 }}>
                      <Text style={{ fontSize: 11, fontWeight: "800", color: "#fff" }}>{chat.unread}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
