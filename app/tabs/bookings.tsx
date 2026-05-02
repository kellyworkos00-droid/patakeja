import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Bell, CalendarDays, ChevronRight, Clock } from "lucide-react-native";
import { bookings } from "@/data/mockBookings";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

export default function MyBookingsScreen() {
  const upcoming = bookings.filter((booking) => booking.status !== "Completed");
  const past = bookings.filter((booking) => booking.status === "Completed");

  return (
    <ScreenContainer contentClassName="pt-4">
      <View className="mb-5 flex-row items-center justify-between">
        <View>
          <Text className="text-4xl font-extrabold text-navy">Bookings</Text>
          <Text className="mt-1 text-base text-navy/60">Your viewing schedule</Text>
        </View>
        <Pressable onPress={() => router.push("/notifications")} className="h-12 w-12 items-center justify-center rounded-full bg-white">
          <Bell color={colors.navy} size={22} />
        </Pressable>
      </View>

      <View className="mb-6 flex-row rounded-full bg-white p-1">
        <View className="flex-1 rounded-full bg-primary py-3">
          <Text className="text-center font-extrabold text-white">Upcoming</Text>
        </View>
        <View className="flex-1 rounded-full py-3">
          <Text className="text-center font-extrabold text-navy/55">Past</Text>
        </View>
      </View>

      <Text className="mb-3 text-xl font-extrabold text-navy">Upcoming Viewings</Text>
      <View className="gap-4">
        {upcoming.map((booking) => (
          <Pressable key={booking.id} onPress={() => router.push("/payments/escrow-status")} className="flex-row gap-4 rounded-3xl bg-white p-3">
            <Image source={booking.image} className="h-24 w-24 rounded-2xl" resizeMode="cover" />
            <View className="flex-1 justify-center">
              <Text className="text-lg font-extrabold text-navy">{booking.title}</Text>
              <Text className="mt-1 text-sm text-navy/55">{booking.location}</Text>
              <View className="mt-2 flex-row items-center gap-2">
                <CalendarDays color={colors.navy} size={15} />
                <Text className="text-sm text-navy/70">{booking.date}</Text>
              </View>
              <View className="mt-1 flex-row items-center gap-2">
                <Clock color={colors.navy} size={15} />
                <Text className="text-sm text-navy/70">{booking.time}</Text>
              </View>
              <View className="mt-2 self-start rounded-full bg-primary/10 px-3 py-1">
                <Text className="text-xs font-extrabold text-primary">{booking.status}</Text>
              </View>
            </View>
            <ChevronRight color={colors.navy} size={20} />
          </Pressable>
        ))}
      </View>

      <AppButton title="Book Another Viewing" onPress={() => router.push("/tabs/explore")} full style={{ marginTop: 22 }} />

      <Text className="mb-3 mt-7 text-xl font-extrabold text-navy">Past Viewings</Text>
      <View className="gap-4">
        {past.map((booking) => (
          <View key={booking.id} className="flex-row gap-4 rounded-3xl bg-white p-3 opacity-80">
            <Image source={booking.image} className="h-20 w-20 rounded-2xl" resizeMode="cover" />
            <View className="flex-1">
              <Text className="text-base font-extrabold text-navy">{booking.title}</Text>
              <Text className="mt-1 text-sm text-navy/55">{booking.location}</Text>
              <Text className="mt-2 text-sm text-navy/70">
                {booking.date} · {booking.time}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}
