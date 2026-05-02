import { Image, Text, View } from "react-native";
import { Check, CreditCard, FileCheck2, Home, ShieldCheck, UserCheck } from "lucide-react-native";
import type { LucideIcon } from "lucide-react-native";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

type VerificationStep = {
  title: string;
  body: string;
  icon: LucideIcon;
  done: boolean;
};

const verificationSteps: VerificationStep[] = [
  { title: "Identity Check", body: "Confirm your legal name with a valid document.", icon: UserCheck, done: true },
  { title: "Document Upload", body: "Upload a clear national ID or passport image.", icon: CreditCard, done: true },
  { title: "Listing Ownership", body: "Provide proof that you manage the home.", icon: Home, done: false },
  { title: "Trust Review", body: "Our team reviews and marks your account verified.", icon: FileCheck2, done: false },
];

export default function VerificationScreen() {
  return (
    <ScreenContainer contentClassName="pt-2">
      <FloatingHeader title="Verification" subtitle="Build trust before tenants contact you" />
      <View className="mb-5 overflow-hidden rounded-[32px] bg-white">
        <Image source={images.verificationDirection} className="h-36 w-full" resizeMode="cover" />
      </View>
      <View className="mb-5 items-center rounded-[32px] bg-white p-6">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck color={colors.primary} size={42} />
        </View>
        <Text className="mt-4 text-center text-2xl font-extrabold text-navy">Verified homes start with verified people</Text>
        <Text className="mt-2 text-center text-base leading-6 text-navy/65">Complete these checks to earn trust badges and improve tenant confidence.</Text>
      </View>

      <View className="rounded-[32px] bg-white p-5">
        {verificationSteps.map((step, index) => {
          const Icon = step.icon;

          return (
          <View key={step.title} className="flex-row gap-4 pb-5">
            <View className="items-center">
              <View className={`h-12 w-12 items-center justify-center rounded-full ${step.done ? "bg-primary" : "bg-primary/10"}`}>
                {step.done ? <Check color={colors.card} size={22} /> : <Icon color={colors.primary} size={23} />}
              </View>
              {index !== verificationSteps.length - 1 ? <View className="h-12 w-1 bg-primary/20" /> : null}
            </View>
            <View className="flex-1">
              <Text className="text-lg font-extrabold text-navy">{step.title}</Text>
              <Text className="mt-1 text-sm leading-5 text-navy/60">{step.body}</Text>
            </View>
          </View>
          );
        })}
      </View>

      <AppButton title="Continue Verification" full style={{ marginTop: 22 }} />
    </ScreenContainer>
  );
}
