import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { ArrowLeft, BedDouble, CalendarDays, Map, MapPin, Mic, Search as SearchIcon, ShieldCheck, SlidersHorizontal, Tag } from "lucide-react-native";
import { listings } from "@/data/mockListings";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { ListingCard } from "@/components/cards/ListingCard";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

const areas = ["Kilimani", "Westlands", "Lavington", "Kileleshwa", "Rongai"];
const filters = [
  ["Price", "Any", Tag],
  ["Bedrooms", "Any", BedDouble],
  ["Distance", "Any", MapPin],
  ["Verified", "Verified only", ShieldCheck],
  ["More Filters", "Advanced", SlidersHorizontal],
];
const budgets = ["Under KES 15,000", "KES 15,000 - 25,000", "KES 25,000 - 40,000", "Above KES 40,000"];
const types = ["Bedsitter", "1 Bedroom", "2 Bedroom", "3 Bedroom", "House", "All Types"];

export default function SearchScreen() {
  return (
    <ScreenContainer contentClassName="pt-3">
      <View className="mb-5 flex-row items-center gap-3">
        <Pressable onPress={() => router.back()} className="h-12 w-12 items-center justify-center rounded-full bg-white">
          <ArrowLeft color={colors.navy} size={22} />
        </Pressable>
        <View className="h-14 flex-1 flex-row items-center gap-3 rounded-full bg-white px-4">
          <SearchIcon color={colors.navy} size={22} />
          <Text className="flex-1 text-base text-navy/50">Search areas, properties or keywords...</Text>
          <Mic color={colors.navy} size={22} />
        </View>
      </View>

      <View className="mb-6 flex-row items-center justify-between">
        <Text className="text-base text-navy/60">Find homes in top locations or near you</Text>
        <Pressable className="flex-row items-center gap-2 rounded-full bg-white px-4 py-3">
          <Map color={colors.navy} size={18} />
          <Text className="font-extrabold text-navy">Map View</Text>
        </Pressable>
      </View>

      <View className="mb-6 overflow-hidden rounded-[28px] bg-white">
        <Image source={images.searchDirection} className="h-36 w-full" resizeMode="cover" />
        <View className="absolute inset-x-0 bottom-0 bg-navy/55 px-4 py-3">
          <Text className="text-base font-extrabold text-white">Smarter filters for faster home discovery</Text>
        </View>
      </View>

      <Text className="mb-3 text-xl font-extrabold text-navy">Popular Areas</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-4 pb-5">
        {areas.map((area, index) => (
          <Pressable key={area} className="w-36">
            <Image source={listings[index % listings.length].image} className="h-24 w-full rounded-2xl" resizeMode="cover" />
            <View className="mt-2 flex-row items-center gap-1">
              <MapPin color={colors.primary} size={16} />
              <Text className="font-extrabold text-navy">{area}</Text>
            </View>
            <Text className="text-sm text-navy/55">Nairobi</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View className="mb-6 flex-row items-center gap-4 rounded-[28px] bg-primary/10 p-4">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-white">
          <MapPin color={colors.primary} size={28} />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-extrabold text-navy">Homes near me</Text>
          <Text className="text-sm text-navy/60">See verified properties within your current area</Text>
        </View>
        <Pressable className="rounded-2xl bg-primary px-4 py-3">
          <Text className="font-extrabold text-white">Use location</Text>
        </Pressable>
      </View>

      <Text className="mb-3 text-xl font-extrabold text-navy">Quick Filters</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3 pb-5">
        {filters.map(([label, value, Icon]) => (
          <Pressable key={label as string} className="w-36 rounded-2xl border border-navy/10 bg-white p-4">
            <Icon color={colors.primary} size={19} />
            <Text className="mt-2 font-extrabold text-navy">{label as string}</Text>
            <Text className="mt-1 text-sm text-navy/55">{value as string}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text className="mb-3 text-xl font-extrabold text-navy">Budget Shortcuts</Text>
      <View className="mb-6 flex-row flex-wrap gap-3">
        {budgets.map((budget) => (
          <Pressable key={budget} className="flex-row items-center gap-2 rounded-full bg-white px-4 py-3">
            <CalendarDays color={colors.primary} size={16} />
            <Text className="font-bold text-navy">{budget}</Text>
          </Pressable>
        ))}
      </View>

      <Text className="mb-3 text-xl font-extrabold text-navy">Property Type</Text>
      <View className="mb-6 flex-row flex-wrap gap-3">
        {types.map((type) => (
          <Pressable key={type} className="w-[30%] items-center rounded-2xl bg-white p-4">
            <BedDouble color={colors.navy} size={21} />
            <Text className="mt-2 text-center text-sm font-bold text-navy">{type}</Text>
          </Pressable>
        ))}
      </View>

      <Text className="mb-3 text-xl font-extrabold text-navy">Recommended for You</Text>
      <View className="gap-4">
        {listings.slice(0, 3).map((listing) => (
          <ListingCard key={listing.id} listing={listing} compact />
        ))}
      </View>
    </ScreenContainer>
  );
}
