import { Image, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Check, Copy, MapPin } from "lucide-react-native";
import { listings } from "@/data/mockListings";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

export default function PaymentConfirmationScreen() {
  const { listingId } = useLocalSearchParams<{ listingId?: string }>();
  const listing = listings.find((item) => item.id === listingId) ?? listings[0];

  return (
    <ScreenContainer contentClassName="items-center pt-10">
      <View className="h-24 w-24 items-center justify-center rounded-full bg-primary">
        <Check color={colors.card} size={54} strokeWidth={3} />
      </View>
      <Text className="mt-6 text-center text-4xl font-extrabold text-navy">Payment Successful!</Text>
      <Text className="mt-3 text-center text-base leading-6 text-navy/65">Your payment has been received and your viewing remains confirmed.</Text>

      <View className="mt-8 w-full rounded-[32px] bg-white p-5">
        <View className="flex-row justify-between">
          <Text className="text-navy/65">Amount Paid</Text>
          <Text className="text-xl font-extrabold text-primary">KES 500</Text>
        </View>
        <View className="mt-4 flex-row justify-between">
          <Text className="text-navy/65">Payment Method</Text>
          <Text className="font-bold text-navy">M-Pesa</Text>
        </View>
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-navy/65">Transaction ID</Text>
          <View className="flex-row items-center gap-2">
            <Text className="font-bold text-navy">QX8M7P2T9Y</Text>
            <Copy color={colors.navy} size={15} />
          </View>
        </View>
      </View>

      <View className="mt-5 w-full rounded-[32px] bg-white p-4">
        <Text className="mb-3 text-xl font-extrabold text-navy">Viewing Details</Text>
        <View className="flex-row gap-4">
          <Image source={listing.image} className="h-24 w-24 rounded-2xl" resizeMode="cover" />
          <View className="flex-1 justify-center">
            <Text className="text-lg font-extrabold text-navy">{listing.title}</Text>
            <Text className="mt-1 text-sm text-navy/55">{listing.location}</Text>
            <View className="mt-2 flex-row items-center gap-2">
              <MapPin color={colors.primary} size={16} />
              <Text className="text-sm text-navy/65">At the property</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="mt-6 w-full gap-3">
        <AppButton title="View Escrow Status" full onPress={() => router.replace("/payments/escrow-status")} />
        <AppButton title="Back to Home" variant="outline" full onPress={() => router.replace("/tabs/home")} />
      </View>
    </ScreenContainer>
  );
}
