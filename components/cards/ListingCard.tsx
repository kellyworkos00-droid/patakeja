import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { BedDouble, CalendarDays, Camera, Heart, MapPin, MessageCircle, MoreVertical } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { Listing } from "@/data/mockListings";
import { ExploreListing } from "@/data/mockExploreListings";
import { AppButton } from "@/components/ui/AppButton";
import { PropertyImage } from "@/components/ui/PropertyImage";
import { TrustBadge } from "@/components/ui/TrustBadge";

type ListingCardProps = {
  listing: Listing | ExploreListing;
  compact?: boolean;
  variant?: "default" | "explore";
};

function isExploreListing(listing: Listing | ExploreListing): listing is ExploreListing {
  return "bedrooms" in listing;
}

export function ListingCard({ listing, compact, variant = "default" }: ListingCardProps) {
  const openListing = () => router.push(`/listing/${listing.id}`);
  const bookViewing = () => router.push(`/bookings/create?listingId=${listing.id}`);
  const openChat = () => router.push(`/chat/${listing.id}`);
  const cardPhotos = isExploreListing(listing) ? listing.photos : listing.photos;

  if (compact || variant === "explore") {
    const showVerified = isExploreListing(listing) ? listing.verified : true;
    const showEscrow = isExploreListing(listing) ? listing.escrowAvailable : true;
    const showSecureChat = isExploreListing(listing) ? listing.secureChat : true;

    return (
      <Pressable onPress={openListing} className="flex-row gap-2.5 rounded-3xl bg-white p-2">
        <View className="relative">
          <PropertyImage source={listing.image} className="h-[110px] w-[102px] rounded-2xl" />
          {cardPhotos > 0 ? (
            <View className="absolute bottom-1.5 left-1.5 flex-row items-center gap-1 rounded-full bg-navy/80 px-2 py-1">
              <Camera color={colors.card} size={12} />
              <Text className="text-[10px] font-bold text-white">{cardPhotos}</Text>
            </View>
          ) : null}
          <Pressable
            style={{
              position: "absolute",
              top: 7,
              right: 7,
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: "rgba(255,255,255,0.88)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart color={colors.navy} size={13} strokeWidth={2} />
          </Pressable>
        </View>

        <View className="flex-1 justify-between py-0.5">
          <View>
            <View className="flex-row items-start justify-between">
              <Text className="text-lg font-extrabold text-navy">
                {listing.price} <Text className="text-[10px] font-semibold text-navy/50">/ month</Text>
              </Text>
              <Pressable className="rounded-full p-1">
                <MoreVertical color="#94A3B8" size={14} />
              </Pressable>
            </View>

            <Text className="mt-0.5 text-sm font-bold text-navy" numberOfLines={1}>
              {listing.title}
            </Text>
            <View className="mt-1.5 flex-row items-center gap-1">
              <MapPin color="rgba(15, 23, 42, 0.45)" size={13} />
              <Text className="text-[11px] text-navy/60" numberOfLines={1}>
                {listing.location}
              </Text>
              <Text className="text-[11px] text-navy/25">·</Text>
              <Text className="text-[11px] font-bold text-primary">{listing.distance}</Text>
            </View>
          </View>

          <View className="mt-1.5 flex-row flex-wrap gap-1.5">
            {showVerified ? <TrustBadge label="Verified" compact /> : null}
            {showSecureChat ? <TrustBadge label="Secure Chat" compact /> : null}
            {showEscrow ? <TrustBadge label="Escrow" compact /> : null}
          </View>
        </View>
      </Pressable>
    );
  }

  if (isExploreListing(listing)) {
    return null;
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
