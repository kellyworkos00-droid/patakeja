import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { CalendarDays, Clock, MapPin } from "lucide-react-native";
import { listings } from "@/data/mockListings";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { SafetyNotice } from "@/components/ui/SafetyNotice";

const dates = ["15", "16", "17", "18", "19", "20", "21"];
const times = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM"];

export default function CreateBookingScreen() {
  const { listingId } = useLocalSearchParams<{ listingId?: string }>();
  const listing = listings.find((item) => item.id === listingId) ?? listings[0];
  const [date, setDate] = useState("18");
  const [time, setTime] = useState("10:00 AM");

  return (
    <ScreenContainer contentClassName="pt-2">
      <FloatingHeader title="Book a Viewing" subtitle="Choose a time that works for you" />
      <View className="mb-6 flex-row gap-4 rounded-3xl bg-white p-3">
        <Image source={listing.image} className="h-28 w-28 rounded-2xl" resizeMode="cover" />
        <View className="flex-1 justify-center">
          <Text className="text-lg font-extrabold text-navy">{listing.title}</Text>
          <Text className="mt-1 text-sm text-navy/55">{listing.location}</Text>
          <Text className="mt-2 text-lg font-extrabold text-primary">
            {listing.price} <Text className="text-sm font-medium text-navy/55">/ month</Text>
          </Text>
        </View>
      </View>

      <Text className="mb-3 text-xl font-extrabold text-navy">Select Date</Text>
      <View className="mb-6 rounded-[32px] bg-white p-5">
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-lg font-extrabold text-navy">May 2026</Text>
          <CalendarDays color={colors.primary} size={22} />
        </View>
        <View className="flex-row justify-between">
          {dates.map((item) => {
            const selected = item === date;
            return (
              <Pressable key={item} onPress={() => setDate(item)} className={`h-12 w-12 items-center justify-center rounded-full ${selected ? "bg-primary" : "bg-background"}`}>
                <Text className={`font-extrabold ${selected ? "text-white" : "text-navy"}`}>{item}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Text className="mb-3 text-xl font-extrabold text-navy">Select Time</Text>
      <View className="mb-5 flex-row flex-wrap gap-3">
        {times.map((item) => {
          const selected = item === time;
          return (
            <Pressable key={item} onPress={() => setTime(item)} className={`rounded-2xl px-5 py-3 ${selected ? "bg-primary" : "bg-white"}`}>
              <Text className={`font-extrabold ${selected ? "text-white" : "text-navy"}`}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      <SafetyNotice message="Viewing details and directions are shared in app after confirmation." />

      <View className="mt-5 rounded-3xl bg-white p-5">
        <View className="flex-row items-center gap-3">
          <MapPin color={colors.primary} size={21} />
          <Text className="flex-1 text-base font-bold text-navy">Meeting point</Text>
          <Text className="text-base text-navy/60">At the property</Text>
        </View>
        <View className="mt-4 flex-row items-center gap-3">
          <Clock color={colors.primary} size={21} />
          <Text className="flex-1 text-base font-bold text-navy">Duration</Text>
          <Text className="text-base text-navy/60">20-30 minutes</Text>
        </View>
      </View>

      <AppButton
        title="Continue to Confirm"
        full
        onPress={() => router.push(`/bookings/confirmation?listingId=${listing.id}&date=${date}&time=${encodeURIComponent(time)}`)}
        style={{ marginTop: 22 }}
      />
    </ScreenContainer>
  );
}
