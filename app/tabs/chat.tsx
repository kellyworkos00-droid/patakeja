import type { ElementType } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Archive, CalendarDays, MessageCircle, Search, ShieldCheck } from "lucide-react-native";
import { chats } from "@/data/mockChats";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { SafetyNotice } from "@/components/ui/SafetyNotice";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

const chatTabs: Array<{ label: string; icon: ElementType; count?: string }> = [
  { label: "All Chats", icon: MessageCircle, count: "12" },
  { label: "Bookings", icon: CalendarDays },
  { label: "Archive", icon: Archive },
];

export default function ChatListScreen() {
  return (
    <ScreenContainer contentClassName="pt-4">
      <View className="mb-5 flex-row items-start justify-between">
        <View>
          <Text className="text-4xl font-extrabold text-navy">Chat</Text>
          <View className="mt-1 flex-row items-center gap-2">
            <Text className="text-base text-navy/60">Secure conversations, safe and private.</Text>
            <ShieldCheck color={colors.primary} size={18} />
          </View>
        </View>
        <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-white">
          <Search color={colors.navy} size={22} />
        </Pressable>
      </View>

      <View className="mb-5 flex-row rounded-3xl bg-white p-2">
        {chatTabs.map((tab, index) => {
          const Icon = tab.icon;
          return (
          <View key={tab.label} className={`flex-1 flex-row items-center justify-center gap-2 rounded-2xl py-3 ${index === 0 ? "bg-navy" : ""}`}>
            <Icon color={index === 0 ? colors.card : colors.navy} size={18} />
            <Text className={`font-bold ${index === 0 ? "text-white" : "text-navy"}`}>{tab.label}</Text>
            {tab.count ? (
              <View className="h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1">
                <Text className="text-xs font-extrabold text-white">{tab.count}</Text>
              </View>
            ) : null}
          </View>
          );
        })}
      </View>

      <View className="mb-5 overflow-hidden rounded-[28px] bg-white">
        <Image source={images.chatDirection} className="h-36 w-full" resizeMode="cover" />
        <View className="absolute inset-x-0 bottom-0 bg-navy/55 px-4 py-3">
          <Text className="text-base font-extrabold text-white">Message securely and book viewings fast</Text>
        </View>
      </View>

      <SafetyNotice />

      <View className="mt-6 gap-1 rounded-[32px] bg-white p-2">
        {chats.map((chat) => (
          <Pressable key={chat.id} onPress={() => router.push(`/chat/${chat.id}`)} className="flex-row gap-4 rounded-3xl p-3">
            <View>
              <Image source={chat.avatar} className="h-16 w-16 rounded-full" resizeMode="cover" />
              <View className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-primary" />
            </View>
            <View className="flex-1 border-b border-navy/10 pb-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Text className="text-lg font-extrabold text-navy">{chat.name}</Text>
                  {chat.verified ? <ShieldCheck color={colors.primary} size={17} /> : null}
                </View>
                <Text className="text-sm text-navy/55">{chat.time}</Text>
              </View>
              <Text className="mt-1 text-sm text-navy/55" numberOfLines={1}>
                {chat.listingTitle}
              </Text>
              <View className="mt-1 flex-row items-center justify-between gap-3">
                <Text className="flex-1 text-base text-navy" numberOfLines={1}>
                  {chat.lastMessage}
                </Text>
                {chat.unread ? (
                  <View className="h-7 min-w-7 items-center justify-center rounded-full bg-primary px-2">
                    <Text className="text-sm font-extrabold text-white">{chat.unread}</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </Pressable>
        ))}
      </View>
    </ScreenContainer>
  );
}
