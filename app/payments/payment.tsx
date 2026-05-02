import { Image, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Banknote, CreditCard, LockKeyhole, Smartphone, WalletCards } from "lucide-react-native";
import { listings } from "@/data/mockListings";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

const methods = [
  { label: "M-Pesa", detail: "Pay easily inside PataKeja", icon: Smartphone, active: true },
  { label: "Debit / Credit Card", detail: "Visa, Mastercard, Verve", icon: CreditCard, active: false },
  { label: "Bank Transfer", detail: "Transfer from your bank", icon: Banknote, active: false },
  { label: "Wallet", detail: "Use your PataKeja wallet", icon: WalletCards, active: false },
];

export default function PaymentScreen() {
  const { listingId } = useLocalSearchParams<{ listingId?: string }>();
  const listing = listings.find((item) => item.id === listingId) ?? listings[0];

  return (
    <ScreenContainer contentClassName="pt-2">
      <FloatingHeader
        title="Make Payment"
        subtitle="Escrow-protected viewing payment"
        right={
          <View className="flex-row items-center gap-2 rounded-full bg-primary/10 px-3 py-2">
            <LockKeyhole color={colors.primary} size={16} />
            <Text className="font-bold text-primary">Secure</Text>
          </View>
        }
      />

      <View className="mb-5 overflow-hidden rounded-[28px] bg-white">
        <Image source={images.paymentDirection} className="h-32 w-full" resizeMode="cover" />
      </View>

      <Text className="mb-3 text-lg font-extrabold text-navy">You are paying for</Text>
      <View className="mb-5 flex-row gap-4 rounded-3xl bg-white p-3">
        <Image source={listing.image} className="h-24 w-24 rounded-2xl" resizeMode="cover" />
        <View className="flex-1 justify-center">
          <Text className="text-lg font-extrabold text-navy">{listing.title}</Text>
          <Text className="mt-1 text-sm text-navy/55">{listing.location}</Text>
          <View className="mt-2 self-start rounded-full bg-primary/10 px-3 py-1">
            <Text className="text-xs font-extrabold text-primary">Viewing Fee</Text>
          </View>
        </View>
      </View>

      <View className="mb-6 rounded-3xl bg-white p-5">
        <Text className="text-base font-bold text-navy">Amount to Pay</Text>
        <Text className="mt-2 text-3xl font-extrabold text-primary">KES 500</Text>
        <Text className="mt-1 text-sm text-navy/55">Held safely through escrow until the viewing is complete.</Text>
      </View>

      <Text className="mb-3 text-xl font-extrabold text-navy">Choose Payment Method</Text>
      <View className="gap-3">
        {methods.map((method) => {
          const Icon = method.icon;
          return (
            <Pressable key={method.label} className={`flex-row items-center gap-4 rounded-3xl border p-4 ${method.active ? "border-primary bg-primary/10" : "border-navy/10 bg-white"}`}>
              <View className={`h-5 w-5 rounded-full border-2 ${method.active ? "border-primary bg-primary" : "border-navy/30"}`} />
              <Icon color={colors.navy} size={27} />
              <View>
                <Text className="font-extrabold text-navy">{method.label}</Text>
                <Text className="mt-1 text-sm text-navy/55">{method.detail}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-5 flex-row items-center justify-center gap-2">
        <LockKeyhole color={colors.primary} size={16} />
        <Text className="font-bold text-primary">Your payment is protected by escrow</Text>
      </View>
      <AppButton title="Pay KES 500" full onPress={() => router.replace(`/payments/confirmation?listingId=${listing.id}`)} style={{ marginTop: 22 }} />
    </ScreenContainer>
  );
}
