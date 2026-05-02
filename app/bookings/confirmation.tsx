import { Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Check, Clock, MapPin } from "lucide-react-native";
import { listings } from "@/data/mockListings";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

export default function BookingConfirmationScreen() {
  const { listingId, date, time } = useLocalSearchParams<{ listingId?: string; date?: string; time?: string }>();
  const listing = listings.find((item) => item.id === listingId) ?? listings[0];
  const displayDate = `Saturday, ${date ?? "18"} May 2026`;
  const displayTime = time ?? "10:00 AM";

  return (
    <ScreenContainer contentClassName="items-center pt-10">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-primary">
        <Check color={colors.card} size={54} strokeWidth={3} />
      </View>
      <Text className="mt-6 text-center text-4xl font-extrabold text-navy">Viewing Booked!</Text>
      <Text className="mt-3 text-center text-base leading-6 text-navy/65">Your viewing has been successfully scheduled and added to My Bookings.</Text>

      <View className="mt-8 w-full rounded-[32px] bg-white p-4">
        <View className="flex-row gap-4">
          <Image source={listing.image} className="h-28 w-28 rounded-2xl" resizeMode="cover" />
          <View className="flex-1 justify-center">
            <Text className="text-lg font-extrabold text-navy">{listing.title}</Text>
            <Text className="mt-1 text-sm text-navy/55">{listing.location}</Text>
            <Text className="mt-2 text-lg font-extrabold text-primary">{listing.price} / month</Text>
          </View>
        </View>
        <View className="mt-5 gap-4 border-t border-navy/10 pt-5">
          <View className="flex-row items-center gap-3">
            <Clock color={colors.primary} size={21} />
            <Text className="flex-1 font-bold text-navy">Date and time</Text>
            <Text className="text-navy/65">{displayDate} · {displayTime}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <MapPin color={colors.primary} size={21} />
            <Text className="flex-1 font-bold text-navy">Meeting point</Text>
            <Text className="text-navy/65">At the property</Text>
          </View>
        </View>
      </View>

      <View className="mt-6 w-full rounded-3xl bg-primary/10 p-4">
        <Text className="text-center text-base font-bold leading-6 text-navy">You will receive an in-app reminder before your viewing.</Text>
      </View>

      <View className="mt-6 w-full gap-3">
        <AppButton title="Pay Viewing Fee" full onPress={() => router.push(`/payments/payment?listingId=${listing.id}`)} />
        <AppButton title="View My Bookings" variant="outline" full onPress={() => router.replace("/tabs/bookings")} />
      </View>
    </ScreenContainer>
  );
}
