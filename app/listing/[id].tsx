import { Image, Pressable, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Bath, BedDouble, CalendarDays, Camera, Car, ChevronLeft, Heart, MapPin, MessageCircle, Share2, Sofa } from "lucide-react-native";
import { listings } from "@/data/mockListings";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { EmptyState } from "@/components/ui/EmptyState";

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const listing = listings.find((item) => item.id === id) ?? listings[0];

  if (!listing) {
    return (
      <ScreenContainer>
        <EmptyState title="Listing unavailable" message="This home may have been removed or is waiting for verification." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer
      padded={false}
      footer={
        <SafeAreaView edges={["bottom"]} className="border-t border-navy/10 bg-white px-5 pt-4">
          <View className="mb-2 flex-row items-center gap-3">
            <View className="flex-1">
              <Text className="text-xl font-extrabold text-navy">{listing.price}</Text>
              <Text className="text-sm text-navy/55">Monthly rent</Text>
            </View>
            <AppButton
              title="Chat"
              variant="secondary"
              onPress={() => router.push(`/chat/${listing.id}`)}
              icon={<MessageCircle color={colors.card} size={18} />}
              style={{ flex: 1 }}
            />
            <AppButton
              title="Book Viewing"
              onPress={() => router.push(`/bookings/create?listingId=${listing.id}`)}
              icon={<CalendarDays color={colors.card} size={18} />}
              style={{ flex: 1.1 }}
            />
          </View>
        </SafeAreaView>
      }
    >
      <View className="h-[390px]">
        <Image source={listing.image} className="h-full w-full" resizeMode="cover" />
        <SafeAreaView className="absolute left-0 right-0 top-0 px-5 pt-2">
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => router.back()} className="h-12 w-12 items-center justify-center rounded-full bg-white">
              <ArrowLeft color={colors.navy} size={22} />
            </Pressable>
            <View className="flex-row gap-3">
              <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-white">
                <Share2 color={colors.navy} size={21} />
              </Pressable>
              <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-white">
                <Heart color={colors.navy} size={21} />
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
        <View className="absolute bottom-7 right-5 flex-row items-center gap-2 rounded-2xl bg-white px-4 py-3">
          <Camera color={colors.primary} size={18} />
          <Text className="font-extrabold text-navy">1 / {listing.photos} Photos</Text>
        </View>
      </View>

      <View className="-mt-8 rounded-t-[36px] bg-background px-5 pt-7">
        <Text className="text-4xl font-extrabold text-navy">
          {listing.price} <Text className="text-xl font-medium text-navy/55">/ month</Text>
        </Text>
        <Text className="mt-2 text-2xl font-extrabold text-navy">{listing.title} in {listing.location.split(",")[0]}</Text>
        <View className="mt-3 flex-row items-center gap-2">
          <MapPin color="rgba(15, 23, 42, 0.55)" size={18} />
          <Text className="text-base text-navy/60">{listing.location}</Text>
          <Text className="text-navy/30">|</Text>
          <Text className="text-base font-bold text-primary">{listing.distance}</Text>
        </View>
        <View className="mt-5 flex-row flex-wrap gap-2">
          <TrustBadge label="Verified Listing" />
          <TrustBadge label="Secure Chat" />
          <TrustBadge label="Escrow Available" />
        </View>

        <View className="my-6 h-px bg-navy/10" />
        <Text className="text-xl font-extrabold text-navy">Description</Text>
        <Text className="mt-3 text-base leading-7 text-navy/70">{listing.description}</Text>

        <View className="mt-6 flex-row gap-3">
          {[
            [BedDouble, listing.beds.toString(), "Bedrooms"],
            [Bath, listing.baths.toString(), "Bathrooms"],
            [Car, listing.parking ? "Yes" : "No", "Parking"],
            [Sofa, "No", "Furnished"],
          ].map(([Icon, value, label]) => (
            <View key={label as string} className="flex-1 items-center rounded-3xl border border-navy/10 bg-white p-4">
              <Icon color={colors.navy} size={25} />
              <Text className="mt-3 text-lg font-extrabold text-navy">{value as string}</Text>
              <Text className="text-center text-sm text-navy/55">{label as string}</Text>
            </View>
          ))}
        </View>

        <Text className="mb-3 mt-7 text-xl font-extrabold text-navy">Amenities</Text>
        <View className="flex-row flex-wrap gap-3">
          {listing.amenities.map((amenity) => (
            <View key={amenity} className="rounded-2xl bg-white px-4 py-3">
              <Text className="font-bold text-navy">{amenity}</Text>
            </View>
          ))}
        </View>

        <Text className="mb-3 mt-7 text-xl font-extrabold text-navy">Location <Text className="font-medium text-navy/55">(Approximate)</Text></Text>
        <View className="mb-8 h-48 overflow-hidden rounded-[32px] bg-white">
          <View className="absolute inset-0 bg-primary/10" />
          <View className="absolute left-8 top-10 h-28 w-28 rounded-full border border-primary/20 bg-primary/10" />
          <View className="absolute right-10 bottom-7 h-20 w-20 rounded-full border border-primary/20 bg-primary/10" />
          <View className="flex-1 items-center justify-center">
            <View className="h-24 w-24 items-center justify-center rounded-full bg-primary/20">
              <MapPin color={colors.primary} size={34} />
            </View>
            <Text className="mt-3 text-lg font-extrabold text-navy">{listing.location.split(",")[0]}</Text>
            <Text className="text-sm text-navy/60">Exact address appears after confirmed booking</Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
