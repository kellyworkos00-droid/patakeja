import { Image, Text, View } from "react-native";
import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

export default function ForgotPasswordScreen() {
  return (
    <ScreenContainer contentClassName="pt-2">
      <FloatingHeader title="Forgot password" subtitle="We will send reset instructions to your email" />
      <Image source={images.forgotDirection} className="mb-5 h-52 w-full rounded-[32px]" resizeMode="cover" />
      <View className="rounded-[32px] bg-white p-5">
        <Text className="text-2xl font-extrabold text-navy">Reset your password</Text>
        <Text className="mt-2 text-base leading-6 text-navy/65">Enter the email linked to your PataKeja account.</Text>
        <View className="mt-6">
          <AppInput label="Email address" placeholder="Enter your email" keyboardType="email-address" icon={<Mail color={colors.navy} size={20} />} />
        </View>
        <AppButton title="Send Reset Link" full onPress={() => router.push("/auth/login")} style={{ marginTop: 22 }} />
      </View>
    </ScreenContainer>
  );
}
