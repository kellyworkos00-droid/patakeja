import { Image, Text, View } from "react-native";
import { Camera, Mail, MapPin, UserRound, WalletCards } from "lucide-react-native";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { SafetyNotice } from "@/components/ui/SafetyNotice";

export default function EditProfileScreen() {
  return (
    <ScreenContainer contentClassName="pt-2">
      <FloatingHeader title="Edit Profile" subtitle="Update your information and preferences" />
      <View className="mb-5 flex-row items-center gap-5 rounded-[32px] bg-white p-5">
        <View>
          <Image source={images.onboardingPerson} className="h-28 w-28 rounded-full" resizeMode="cover" />
          <View className="absolute bottom-1 right-1 h-11 w-11 items-center justify-center rounded-full bg-white">
            <Camera color={colors.primary} size={22} />
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-xl font-extrabold text-navy">Profile Photo</Text>
          <Text className="mt-1 text-sm text-navy/60">JPG, PNG, or WEBP. Max size 2MB.</Text>
          <AppButton title="Change Photo" variant="outline" size="sm" style={{ alignSelf: "flex-start", marginTop: 12 }} />
        </View>
      </View>

      <View className="gap-4 rounded-[32px] bg-white p-5">
        <Text className="text-xl font-extrabold text-navy">Basic Information</Text>
        <AppInput label="Full Name" defaultValue="Brian Kariuki" icon={<UserRound color={colors.primary} size={20} />} />
        <AppInput label="Email Address" defaultValue="brian.kariuki@email.com" icon={<Mail color={colors.primary} size={20} />} />
        <AppInput label="Location" defaultValue="Kilimani, Nairobi" icon={<MapPin color={colors.primary} size={20} />} />
      </View>

      <View className="mt-5 gap-4 rounded-[32px] bg-white p-5">
        <Text className="text-xl font-extrabold text-navy">Preferences</Text>
        <AppInput label="Preferred Budget Range" defaultValue="KES 10,000 - KES 40,000" icon={<WalletCards color={colors.primary} size={20} />} />
        <AppInput label="Preferred Locations" defaultValue="Kilimani, Rongai, Westlands" icon={<MapPin color={colors.primary} size={20} />} />
      </View>

      <View className="mt-5">
        <SafetyNotice message="We never show your personal contact details on public listings or chat previews." />
      </View>
      <AppButton title="Save Changes" full style={{ marginTop: 22 }} />
    </ScreenContainer>
  );
}
