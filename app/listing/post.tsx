import { Image, Text, View } from "react-native";
import { router } from "expo-router";
import { BedDouble, Camera, Home, MapPin, ShieldCheck, WalletCards } from "lucide-react-native";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { SafetyNotice } from "@/components/ui/SafetyNotice";

export default function PostListingScreen() {
  return (
    <ScreenContainer contentClassName="pt-2">
      <FloatingHeader title="Post Listing" subtitle="Create a verified rental listing" />
      <View className="mb-5 overflow-hidden rounded-[32px] bg-white">
        <Image source={images.postListingDirection} className="h-44 w-full" resizeMode="cover" />
      </View>
      <View className="mb-5 rounded-[32px] bg-white p-5">
        <View className="h-44 items-center justify-center rounded-[28px] border border-dashed border-primary bg-primary/10">
          <Camera color={colors.primary} size={36} />
          <Text className="mt-3 text-lg font-extrabold text-navy">Add property photos</Text>
          <Text className="mt-1 text-sm text-navy/60">Use clear, current photos of the actual home.</Text>
        </View>
      </View>

      <View className="gap-4 rounded-[32px] bg-white p-5">
        <Text className="text-xl font-extrabold text-navy">Listing Details</Text>
        <AppInput label="Title" placeholder="2 Bedroom Apartment" icon={<Home color={colors.primary} size={20} />} />
        <AppInput label="Monthly Rent" placeholder="KES 35,000" keyboardType="numeric" icon={<WalletCards color={colors.primary} size={20} />} />
        <AppInput label="Approximate Location" placeholder="Kilimani, Nairobi" icon={<MapPin color={colors.primary} size={20} />} />
        <AppInput label="Bedrooms" placeholder="2 Bedrooms" icon={<BedDouble color={colors.primary} size={20} />} />
        <AppInput label="Description" placeholder="Describe the home, amenities, and viewing notes" multiline numberOfLines={4} textAlignVertical="top" />
      </View>

      <View className="mt-5 rounded-[32px] bg-white p-5">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <ShieldCheck color={colors.primary} size={25} />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-extrabold text-navy">Verification required</Text>
            <Text className="mt-1 text-sm leading-5 text-navy/60">Listings go live after a trust review. This protects tenants and landlords.</Text>
          </View>
        </View>
      </View>

      <View className="mt-5">
        <SafetyNotice message="Do not include phone numbers, external links, or payment instructions in listings." />
      </View>
      <AppButton title="Submit for Review" full onPress={() => router.push("/settings/verification")} style={{ marginTop: 22 }} />
    </ScreenContainer>
  );
}
