import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { BedDouble, ChevronDown, Grid2X2, Home, LocateFixed, Map, Search, SlidersHorizontal } from "lucide-react-native";
import { listings } from "@/data/mockListings";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { ListingCard } from "@/components/cards/ListingCard";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

const filters = [
  { label: "All", icon: Grid2X2 },
  { label: "Bedsitters", icon: Home },
  { label: "1 Bedroom", icon: BedDouble },
  { label: "2 Bedroom", icon: BedDouble },
  { label: "3+ Bedroom", icon: BedDouble },
];

export default function ExploreScreen() {
  return (
    <ScreenContainer contentClassName="pt-4">
      <View className="mb-5 flex-row items-start justify-between">
        <View>
          <Text className="text-4xl font-extrabold text-navy">Explore</Text>
          <Text className="mt-1 text-base text-navy/60">Find your perfect home</Text>
        </View>
        <Pressable onPress={() => router.push("/search")} className="h-12 w-12 items-center justify-center rounded-full bg-white">
          <SlidersHorizontal color={colors.navy} size={22} />
          <View className="absolute right-3 top-2 h-2.5 w-2.5 rounded-full bg-primary" />
        </Pressable>
      </View>

      <Pressable onPress={() => router.push("/search")} className="mb-5 h-16 flex-row items-center gap-3 rounded-full bg-white px-5">
        <Search color={colors.primary} size={23} />
        <Text className="flex-1 text-base font-medium text-navy/50">Search location, area or property...</Text>
        <View className="h-8 w-px bg-navy/10" />
        <Text className="font-bold text-navy">Filters</Text>
      </Pressable>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 pb-5">
        {filters.map((filter, index) => {
          const Icon = filter.icon;
          const active = index === 0;
          return (
            <Pressable key={filter.label} className={`h-12 flex-row items-center gap-2 rounded-full px-5 ${active ? "bg-navy" : "bg-white"}`}>
              <Icon color={active ? colors.card : colors.navy} size={18} />
              <Text className={`font-bold ${active ? "text-white" : "text-navy"}`}>{filter.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="mb-6 h-44 overflow-hidden rounded-[32px] bg-white">
        <Image source={images.exploreDirection} className="h-full w-full" resizeMode="cover" />
        <View className="absolute inset-0 bg-navy/35" />
        <View className="flex-1 items-center justify-center">
          <View className="flex-row items-center gap-2 rounded-full bg-white px-5 py-3">
            <Map color={colors.navy} size={20} />
            <Text className="font-extrabold text-navy">View on Map</Text>
          </View>
        </View>
        <Pressable className="absolute bottom-4 right-4 h-11 w-11 items-center justify-center rounded-full bg-white">
          <LocateFixed color={colors.navy} size={20} />
        </Pressable>
      </View>

      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-base font-semibold text-navy/70">256 homes found</Text>
        <View className="flex-row items-center gap-1">
          <Text className="font-bold text-navy">Sort by: Newest</Text>
          <ChevronDown color={colors.navy} size={16} />
        </View>
      </View>

      <View className="gap-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} compact />
        ))}
      </View>
    </ScreenContainer>
  );
}
