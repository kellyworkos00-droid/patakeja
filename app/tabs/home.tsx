import type { ElementType } from "react";
import { Image, Pressable, ScrollView, Text, View, TextInput } from "react-native";
import { router } from "expo-router";
import {
  Bell,
  ChevronRight,
  MapPin,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  LockKeyhole,
  MessageCircle,
  Home,
  Building,
  Building2,
  Bed,
  User,
} from "lucide-react-native";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { listings, Listing } from "@/data/mockListings";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

const cardShadow = {
  shadowColor: colors.navy,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.10,
  shadowRadius: 16,
  elevation: 6,
};

const filters = [
  { label: "All", icon: Building2 },
  { label: "Bedsitters", icon: Bed },
  { label: "1 Bedroom", icon: Bed },
  { label: "2 Bedroom", icon: Bed },
  { label: "3+ Bedroom", icon: Bed },
];

const featuredHomes = [
  { ...listings[0], rating: "4.8" },
  { ...listings[1], rating: "4.6" },
  { ...listings[2], rating: "4.9" },
];

const nearYouHomes = [
  listings[0],
  listings[1],
  listings[2],
  listings[3],
];

function FilterChip({ label, icon: Icon, active, onPress }: { label: string; icon: ElementType; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`h-11 flex-row items-center gap-2 rounded-full px-5 ${active ? "bg-primary" : "bg-white"}`}
      style={active ? undefined : cardShadow}
    >
      <Icon color={active ? colors.card : colors.navy} size={18} strokeWidth={active ? 2.6 : 2.2} />
      <Text className={`text-base font-semibold ${active ? "text-white" : "text-navy"}`}>{label}</Text>
    </Pressable>
  );
}

function TrustBadge({ type }: { type: "Verified" | "Secure Chat" | "Escrow" }) {
  const config = {
    Verified: { icon: ShieldCheck, color: colors.primary, label: "Verified" },
    "Secure Chat": { icon: LockKeyhole, color: "#F59E0B", label: "Secure Chat" },
    Escrow: { icon: ShieldCheck, color: "#8B5CF6", label: "Escrow" },
  };
  const { icon: Icon, color, label } = config[type];

  return (
    <View className="flex-row items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
      <Icon color={color} size={12} strokeWidth={2.6} />
      <Text className="text-xs font-semibold text-navy/70">{label}</Text>
    </View>
  );
}

function FeaturedCard({ listing }: { listing: Listing & { rating?: string } }) {
  return (
    <Pressable onPress={() => router.push(`/listing/${listing.id}`)} className="w-72 overflow-hidden rounded-[20px] bg-white" style={cardShadow}>
      <View className="h-44">
        <Image source={listing.image} className="h-full w-full" resizeMode="cover" />
        <View className="absolute top-3 right-3 h-10 w-10 items-center justify-center rounded-full bg-white/90">
          <Text style={{ fontSize: 22 }}>♡</Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="text-2xl font-bold text-navy">
          {listing.price} <Text className="text-sm font-medium text-navy/50">/ month</Text>
        </Text>
        <Text className="mt-1 text-lg font-bold text-navy" numberOfLines={1}>
          {listing.title}
        </Text>
        <View className="mt-2 flex-row items-center gap-1.5">
          <MapPin color={colors.navy + "80"} size={14} />
          <Text className="flex-1 text-sm font-medium text-navy/50" numberOfLines={1}>
            {listing.location}
          </Text>
          <Text className="text-sm font-medium text-navy/50">•</Text>
          <Text className="text-sm font-medium text-primary">{listing.distance}</Text>
        </View>
        <View className="mt-3 flex-row gap-2">
          <TrustBadge type="Verified" />
          <TrustBadge type="Secure Chat" />
          <TrustBadge type="Escrow" />
        </View>
      </View>
    </Pressable>
  );
}

function NearYouCard({ listing }: { listing: Listing }) {
  return (
    <Pressable onPress={() => router.push(`/listing/${listing.id}`)} className="mb-4 flex-row gap-4 rounded-[20px] bg-white p-3" style={cardShadow}>
      <View className="w-32 h-32 overflow-hidden rounded-[16px]">
        <Image source={listing.image} className="h-full w-full" resizeMode="cover" />
      </View>
      <View className="flex-1 justify-center">
        <Text className="text-xl font-bold text-navy">{listing.price}</Text>
        <Text className="mt-0.5 text-base font-semibold text-navy" numberOfLines={1}>
          {listing.title}
        </Text>
        <View className="mt-1 flex-row items-center gap-1">
          <MapPin color={colors.navy + "80"} size={12} />
          <Text className="text-xs font-medium text-navy/50" numberOfLines={1}>
            {listing.location}
          </Text>
        </View>
        <View className="mt-2 flex-row gap-1.5">
          <TrustBadge type="Verified" />
        </View>
        <View className="mt-3 flex-row gap-2">
          <Pressable className="flex-1 rounded-full bg-primary py-2.5">
            <Text className="text-center text-sm font-bold text-white">Book Viewing</Text>
          </Pressable>
          <Pressable className="w-10 items-center justify-center rounded-full bg-gray-100">
            <MessageCircle color={colors.navy} size={18} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <ScreenContainer contentClassName="pb-24">
      {/* Floating Search Bar */}
      <View style={{ zIndex: 2 }} className="mb-2 mt-2 flex-row items-center justify-between px-1">
        <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-white" style={cardShadow}>
          <User color={colors.navy} size={24} />
        </Pressable>
        <View className="flex-1 px-2">
          <View className="flex-row items-center rounded-full bg-white px-4 py-3" style={cardShadow}>
            <MapPin color={colors.primary} size={20} />
            <Text className="flex-1 px-2 text-base text-navy/60">Where do you want to live?</Text>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-navy">
              <SlidersHorizontal color={colors.card} size={20} />
            </Pressable>
          </View>
        </View>
        <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-white ml-2" style={cardShadow}>
          <Bell color={colors.navy} size={22} />
          <View className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary" />
        </Pressable>
      </View>

      {/* Quick Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 pb-4 px-1">
        {filters.map((filter, index) => (
          <FilterChip key={filter.label} label={filter.label} icon={filter.icon} active={index === 0} />
        ))}
      </ScrollView>

      {/* Hero Banner */}
      <View className="mb-6 mt-1 flex-row items-center rounded-3xl bg-navy" style={cardShadow}>
        <View className="flex-1 px-6 py-7">
          <Text className="text-lg font-extrabold text-primary">Find your next</Text>
          <Text className="mt-2 text-[32px] font-extrabold leading-[38px] text-white">
            Home with Confidence<Text className="text-primary">.</Text>
          </Text>
          <Text className="mt-3 text-base font-medium text-white/90">Verified homes. Secure chat. Safe payments.</Text>
          <Pressable className="mt-5 w-40 rounded-full bg-primary py-3" style={cardShadow}>
            <Text className="text-center text-base font-bold text-white">Explore Homes</Text>
          </Pressable>
        </View>
        <Image source={images.propertyLiving} className="h-44 w-44 rounded-3xl" resizeMode="cover" />
      </View>

      <View className="mb-6 overflow-hidden rounded-[30px] bg-white" style={cardShadow}>
        <Image source={images.homeDirection} className="h-40 w-full" resizeMode="cover" />
        <View className="absolute inset-x-0 bottom-0 bg-navy/60 px-5 py-4">
          <Text className="text-base font-extrabold text-white">Browse trusted homes with full context before booking</Text>
        </View>
      </View>

      {/* Featured Section */}
      <View className="mb-4">
        <View className="mb-3 flex-row items-center justify-between px-1">
          <Text className="text-xl font-bold text-navy">Featured Homes</Text>
          <Pressable className="flex-row items-center gap-1">
            <Text className="text-sm font-semibold text-primary">See all</Text>
            <ChevronRight color={colors.primary} size={16} />
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4 pb-2 px-1">
          {featuredHomes.map((listing) => (
            <FeaturedCard key={listing.id} listing={listing} />
          ))}
        </ScrollView>
      </View>

      {/* Homes Near You */}
      <View>
        <View className="mb-3 flex-row items-center justify-between px-1">
          <Text className="text-xl font-bold text-navy">Recommended For You</Text>
          <Pressable className="flex-row items-center gap-1">
            <Text className="text-sm font-semibold text-primary">See all</Text>
            <ChevronRight color={colors.primary} size={16} />
          </Pressable>
        </View>
        {nearYouHomes.map((listing) => (
          <NearYouCard key={listing.id} listing={listing} />
        ))}
      </View>

      {/* Trust Indicators */}
      <View className="mt-6 flex-row items-center justify-center gap-8">
        <View className="flex-row items-center gap-2">
          <ShieldCheck color={colors.primary} size={20} />
          <Text className="text-sm font-medium text-navy/60">Verified</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <LockKeyhole color={colors.primary} size={20} />
          <Text className="text-sm font-medium text-navy/60">Secure Chat</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <ShieldCheck color={colors.primary} size={20} />
          <Text className="text-sm font-medium text-navy/60">Safe Payments</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
