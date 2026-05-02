import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Bell, CalendarDays, ChevronRight, Home, MessageCircle, Settings, ShieldCheck, Star, WalletCards } from "lucide-react-native";
import { images } from "@/constants/assets";
import { listings } from "@/data/mockListings";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { PropertyImage } from "@/components/ui/PropertyImage";

const profileStats = [
  { value: "12", label: "Listings", icon: Home },
  { value: "48", label: "Chats", icon: MessageCircle },
  { value: "15", label: "Viewings", icon: CalendarDays },
  { value: "4.8", label: "Rating", icon: Star },
];

const accountOverview = [
  { value: "KES 0.00", label: "Wallet", icon: WalletCards },
  { value: "Secure", label: "Status", icon: ShieldCheck },
  { value: "3", label: "Upcoming", icon: CalendarDays },
];

export default function ProfileScreen() {
  return (
    <ScreenContainer contentClassName="pt-4">
      <View className="mb-5 flex-row items-start justify-between">
        <View>
          <Text className="text-4xl font-extrabold text-navy">Profile</Text>
          <Text className="mt-1 text-base text-navy/60">Manage your account and listings</Text>
        </View>
        <View className="flex-row gap-2">
          <Pressable onPress={() => router.push("/notifications")} className="h-12 w-12 items-center justify-center rounded-full bg-white">
            <Bell color={colors.navy} size={22} />
            <View className="absolute right-3 top-2 h-2.5 w-2.5 rounded-full bg-primary" />
          </Pressable>
          <Pressable onPress={() => router.push("/settings")} className="h-12 w-12 items-center justify-center rounded-full bg-white">
            <Settings color={colors.navy} size={22} />
          </Pressable>
        </View>
      </View>

      <View className="mb-6 rounded-[32px] bg-navy p-5">
        <View className="flex-row items-center gap-4">
          <Image source={images.onboardingPerson} className="h-24 w-24 rounded-full border-4 border-white" resizeMode="cover" />
          <View className="flex-1">
            <View className="flex-row items-center gap-2">
              <Text className="text-2xl font-extrabold text-white">Brian Kariuki</Text>
              <ShieldCheck color={colors.primary} size={20} />
            </View>
            <Text className="mt-1 text-white/75">Member since May 2026</Text>
            <View className="mt-3 self-start rounded-full bg-primary/20 px-3 py-1">
              <Text className="font-bold text-white">Verified Account</Text>
            </View>
          </View>
          <AppButton title="Edit" variant="ghost" onPress={() => router.push("/settings/edit-profile")} />
        </View>
        <View className="mt-6 flex-row justify-between rounded-3xl bg-white/10 p-4">
          {profileStats.map((item) => {
            const Icon = item.icon;
            return (
            <View key={item.label} className="items-center">
              <Icon color={colors.primary} size={20} />
              <Text className="mt-1 text-xl font-extrabold text-white">{item.value}</Text>
              <Text className="text-xs text-white/70">{item.label}</Text>
            </View>
            );
          })}
        </View>
      </View>

      <View className="mb-6 overflow-hidden rounded-[32px] bg-white">
        <Image source={images.profileDirection} className="h-40 w-full" resizeMode="cover" />
        <View className="absolute inset-x-0 bottom-0 bg-navy/60 px-5 py-4">
          <Text className="text-base font-extrabold text-white">Track listings, chats, and trust status from one place</Text>
        </View>
      </View>

      <View className="mb-6 rounded-[32px] bg-white p-5">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-extrabold text-navy">Account Overview</Text>
          <Pressable onPress={() => router.push("/payments/escrow-status")} className="flex-row items-center">
            <Text className="font-bold text-navy">View all</Text>
            <ChevronRight color={colors.navy} size={17} />
          </Pressable>
        </View>
        <View className="flex-row gap-3">
          {accountOverview.map((item) => {
            const Icon = item.icon;
            return (
            <View key={item.label} className="flex-1 items-center rounded-2xl border border-navy/10 p-3">
              <View className="h-11 w-11 items-center justify-center rounded-full bg-primary/10">
                <Icon color={colors.primary} size={21} />
              </View>
              <Text className="mt-2 text-base font-extrabold text-navy">{item.value}</Text>
              <Text className="text-xs text-navy/55">{item.label}</Text>
            </View>
            );
          })}
        </View>
      </View>

      <View className="mb-6 rounded-[32px] bg-white p-5">
        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-xl font-extrabold text-navy">My Listings</Text>
          <Pressable onPress={() => router.push("/listing/post")} className="flex-row items-center">
            <Text className="font-bold text-primary">Post listing</Text>
            <ChevronRight color={colors.primary} size={17} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
          {listings.slice(0, 3).map((listing) => (
            <Pressable key={listing.id} onPress={() => router.push(`/listing/${listing.id}`)} className="w-52">
              <PropertyImage source={listing.image} className="h-28 w-full rounded-2xl" />
              <Text className="mt-2 font-extrabold text-navy" numberOfLines={1}>
                {listing.title}
              </Text>
              <Text className="mt-1 text-sm text-navy/55">{listing.location}</Text>
              <Text className="mt-2 font-extrabold text-primary">{listing.price} / month</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="rounded-[32px] bg-navy p-5">
        <Text className="text-2xl font-extrabold text-white">Get Verified</Text>
        <Text className="mt-2 text-base leading-6 text-white/80">Increase trust and make your listings easier for tenants to choose.</Text>
        <AppButton title="Verify Now" variant="ghost" onPress={() => router.push("/settings/verification")} style={{ marginTop: 18 }} />
      </View>
    </ScreenContainer>
  );
}
