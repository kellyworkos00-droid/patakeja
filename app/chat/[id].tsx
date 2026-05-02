import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, CalendarDays, Send, ShieldCheck } from "lucide-react-native";
import { chats } from "@/data/mockChats";
import { listings } from "@/data/mockListings";
import { colors } from "@/constants/colors";
import { SafetyNotice } from "@/components/ui/SafetyNotice";

const MY_SENDER = "me" as const;

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const chat = chats.find((thread) => thread.id === id || thread.listingId === id) ?? chats[0];
  const listing = listings.find((item) => item.id === chat.listingId) ?? listings[0];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      <View className="border-b border-navy/10 bg-background px-5 pb-4 pt-2">
        <View className="flex-row items-center gap-3">
          <Pressable onPress={() => router.back()} className="h-11 w-11 items-center justify-center rounded-full bg-white">
            <ArrowLeft color={colors.navy} size={22} />
          </Pressable>
          <Image source={chat.avatar} className="h-12 w-12 rounded-full" resizeMode="cover" />
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg font-extrabold text-navy">{chat.name}</Text>
              <ShieldCheck color={colors.primary} size={17} />
            </View>
            <Text className="text-sm text-navy/55" numberOfLines={1}>
              {chat.listingTitle}
            </Text>
          </View>
          <Pressable onPress={() => router.push(`/bookings/create?listingId=${listing.id}`)} className="h-11 w-11 items-center justify-center rounded-full bg-primary">
            <CalendarDays color={colors.card} size={21} />
          </Pressable>
        </View>
      </View>

      <ScrollView className="flex-1 px-5" contentContainerClassName="gap-4 py-5" showsVerticalScrollIndicator={false}>
        <SafetyNotice />
        {chat.messages.map((message) => {
          const mine = message.from === MY_SENDER;
          return (
            <View key={message.id} className={`max-w-[82%] rounded-[26px] px-4 py-3 ${mine ? "self-end bg-primary" : "self-start bg-white"}`}>
              <Text className={`text-base leading-6 ${mine ? "text-white" : "text-navy"}`}>{message.text}</Text>
              <Text className={`mt-1 text-xs ${mine ? "text-white/70" : "text-navy/45"}`}>{message.time}</Text>
            </View>
          );
        })}
      </ScrollView>

      <SafeAreaView edges={["bottom"]} className="border-t border-navy/10 bg-white px-5 pt-3">
        <View className="mb-2 flex-row items-center gap-3">
          <TextInput
            className="h-13 flex-1 rounded-full bg-background px-5 text-base text-navy"
            placeholder="Message inside PataKeja..."
            placeholderTextColor="rgba(15, 23, 42, 0.45)"
          />
          <Pressable className="h-13 w-13 items-center justify-center rounded-full bg-primary">
            <Send color={colors.card} size={20} />
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
}
