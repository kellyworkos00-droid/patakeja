import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { BedDouble, CalendarDays, Camera, MapPin, MessageCircle } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { Listing } from "@/data/mockListings";
import { AppButton } from "@/components/ui/AppButton";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { TrustBadge } from "@/components/ui/TrustBadge";

type ListingCardProps = {
  listing: Listing;
  compact?: boolean;
};

export function ListingCard({ listing, compact }: ListingCardProps) {
  const openListing = () => router.push(`/listing/${listing.id}`);
  const bookViewing = () => router.push(`/bookings/create?listingId=${listing.id}`);
  const openChat = () => router.push(`/chat/${listing.id}`);

  if (compact) {
    return (
      <Pressable onPress={openListing} className="flex-row gap-3 rounded-3xl bg-white p-3">
        <View>
          <PropertyImage source={listing.image} className="h-32 w-32 rounded-2xl" />
          <View className="absolute bottom-2 left-2 flex-row items-center gap-1 rounded-full bg-navy/80 px-2 py-1">
            <Camera color={colors.card} size={13} />
            <Text className="text-xs font-bold text-white">{listing.photos}</Text>
          </View>
        </View>
        <View className="flex-1 py-1">
          <Text className="text-xl font-extrabold text-navy">
            {listing.price} <Text className="text-sm font-medium text-navy/55">/ month</Text>
          </Text>
          <Text className="mt-1 text-base font-bold text-navy" numberOfLines={1}>
            {listing.title}
          </Text>
          <View className="mt-2 flex-row items-center gap-1">
            <MapPin color="rgba(15, 23, 42, 0.55)" size={15} />
            <Text className="flex-1 text-sm text-navy/60" numberOfLines={1}>
              {listing.location} · {listing.distance}
            </Text>
          </View>
          <View className="mt-3 flex-row flex-wrap gap-2">
            <TrustBadge label="Verified" compact />
            <TrustBadge label="Secure Chat" compact />
            <TrustBadge label="Escrow" compact />
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={openListing} className="overflow-hidden rounded-3xl bg-white">
      <View>
        <PropertyImage source={listing.image} className="h-56 w-full" />
        <View className="absolute bottom-3 left-3 flex-row items-center gap-1 rounded-full bg-navy/80 px-3 py-1.5">
          <Camera color={colors.card} size={14} />
          <Text className="text-xs font-bold text-white">{listing.photos}</Text>
        </View>
      </View>
      <View className="p-4">
        <Text className="text-2xl font-extrabold text-navy">
          {listing.price} <Text className="text-base font-medium text-navy/55">/ month</Text>
        </Text>
        <Text className="mt-1 text-lg font-bold text-navy">{listing.title}</Text>
        <View className="mt-2 flex-row items-center gap-1">
          <MapPin color="rgba(15, 23, 42, 0.55)" size={15} />
          <Text className="text-sm text-navy/60">
            {listing.location} · {listing.distance}
          </Text>
        </View>
        <View className="mt-3 flex-row flex-wrap gap-2">
          <TrustBadge label="Verified" compact />
          <TrustBadge label="Secure Chat" compact />
          <TrustBadge label="Escrow" compact />
        </View>
        <View className="mt-4 flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <BedDouble color={colors.navy} size={16} />
            <Text className="text-sm font-semibold text-navy/70">{listing.beds} Beds</Text>
          </View>
          <View className="h-1 w-1 rounded-full bg-navy/30" />
          <Text className="text-sm font-semibold text-navy/70">{listing.baths} Baths</Text>
          <View className="h-1 w-1 rounded-full bg-navy/30" />
          <Text className="text-sm font-semibold text-navy/70">{listing.parking ? "Parking" : "No Parking"}</Text>
        </View>
        <View className="mt-4 flex-row gap-3">
          <AppButton title="Book Viewing" onPress={bookViewing} icon={<CalendarDays color={colors.card} size={18} />} style={{ flex: 1 }} />
          <AppButton
            title="Chat"
            onPress={openChat}
            variant="secondary"
            icon={<MessageCircle color={colors.card} size={18} />}
            style={{ flex: 1 }}
          />
        </View>
      </View>
    </Pressable>
  );
}
