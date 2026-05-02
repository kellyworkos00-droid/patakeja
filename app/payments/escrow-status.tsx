import { Text, View } from "react-native";
import { Check, ChevronRight, Circle, HelpCircle, ShieldCheck } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

const steps = [
  { title: "Payment Received", body: "Your payment has been received and secured in escrow.", done: true },
  { title: "Viewing Scheduled", body: "Your viewing is confirmed in My Bookings.", done: true },
  { title: "Viewing Completed", body: "Once the viewing is completed, confirmation unlocks the next step.", done: false },
  { title: "Payment Released", body: "Funds are released after completion according to PataKeja policy.", done: false },
];

export default function EscrowStatusScreen() {
  return (
    <ScreenContainer contentClassName="pt-2">
      <FloatingHeader title="Escrow Status" subtitle="Track the protected payment flow" />

      <View className="mb-5 flex-row gap-4 rounded-[32px] bg-white p-5">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck color={colors.primary} size={34} />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-extrabold text-navy">Your payment is in escrow</Text>
          <Text className="mt-2 text-base leading-6 text-navy/65">Your money is safely held and will only move through the protected PataKeja flow.</Text>
        </View>
      </View>

      <View className="rounded-[32px] bg-white p-5">
        <Text className="mb-5 text-xl font-extrabold text-navy">Escrow Progress</Text>
        {steps.map((step, index) => (
          <View key={step.title} className="flex-row gap-4">
            <View className="items-center">
              <View className={`h-9 w-9 items-center justify-center rounded-full ${step.done ? "bg-primary" : "bg-navy/10"}`}>
                {step.done ? <Check color={colors.card} size={18} /> : <Text className="font-extrabold text-navy/55">{index + 1}</Text>}
              </View>
              {index !== steps.length - 1 ? <View className={`h-16 w-1 ${step.done ? "bg-primary" : "bg-navy/10"}`} /> : null}
            </View>
            <View className="flex-1 pb-6">
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-extrabold text-navy">{step.title}</Text>
                {step.done ? <Check color={colors.primary} size={20} /> : <Circle color="rgba(15, 23, 42, 0.25)" size={20} />}
              </View>
              <Text className="mt-1 text-sm leading-5 text-navy/60">{step.body}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="mt-5 rounded-3xl bg-white p-5">
        <Text className="text-xl font-extrabold text-navy">Booking Summary</Text>
        <View className="mt-4 gap-3">
          <View className="flex-row justify-between"><Text className="text-navy/60">Property</Text><Text className="font-bold text-navy">2 Bedroom Apartment</Text></View>
          <View className="flex-row justify-between"><Text className="text-navy/60">Location</Text><Text className="font-bold text-navy">Kilimani, Nairobi</Text></View>
          <View className="flex-row justify-between"><Text className="text-navy/60">Amount in Escrow</Text><Text className="font-extrabold text-primary">KES 500</Text></View>
        </View>
      </View>

      <View className="mt-5 flex-row items-center gap-4 rounded-3xl bg-white p-5">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <HelpCircle color={colors.primary} size={24} />
        </View>
        <View className="flex-1">
          <Text className="font-extrabold text-navy">Need help?</Text>
          <Text className="mt-1 text-sm text-navy/60">Our support team can review any payment issue inside the app.</Text>
        </View>
        <ChevronRight color={colors.navy} size={20} />
      </View>
    </ScreenContainer>
  );
}
