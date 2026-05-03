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

    const beds = isExploreListing(listing) ? listing.bedrooms : listing.beds;
    const baths = isExploreListing(listing) ? listing.bathrooms : listing.baths;

    return (
      <Pressable
        onPress={openListing}
        style={{
          flexDirection: "row",
          gap: 10,
          borderRadius: 24,
          backgroundColor: "#FFFFFF",
          borderWidth: 1,
          borderColor: "#EDF2F7",
          padding: 8,
        }}
      >
        <View style={{ position: "relative" }}>
          <PropertyImage source={listing.image} className="h-[104px] w-[96px] rounded-[18px]" />
          {cardPhotos > 0 ? (
            <View
              style={{
                position: "absolute",
                left: 6,
                bottom: 6,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                borderRadius: 999,
                backgroundColor: "rgba(15,23,42,0.82)",
                paddingHorizontal: 7,
                paddingVertical: 4,
              }}
            >
              <Camera color={colors.card} size={11} />
              <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: "800" }}>{cardPhotos}</Text>
            </View>
          ) : null}

          <Pressable
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 24,
              height: 24,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.9)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Heart color={colors.navy} size={12} strokeWidth={2.1} />
          </Pressable>
        </View>

        <View style={{ flex: 1, justifyContent: "space-between", paddingTop: 2, paddingBottom: 2 }}>
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 19, fontWeight: "800", color: colors.navy }}>
                {listing.price} <Text style={{ fontSize: 10, color: "#94A3B8", fontWeight: "700" }}>/ month</Text>
              </Text>
              <Pressable style={{ width: 22, height: 22, borderRadius: 11, alignItems: "center", justifyContent: "center" }}>
                <MoreVertical color="#94A3B8" size={13} />
              </Pressable>
            </View>

            <Text style={{ marginTop: 2, fontSize: 13, fontWeight: "700", color: colors.navy }} numberOfLines={1}>
              {listing.title}
            </Text>

            <View style={{ marginTop: 4, flexDirection: "row", alignItems: "center", gap: 4 }}>
              <MapPin color="#94A3B8" size={12} />
              <Text style={{ flexShrink: 1, fontSize: 11, color: "#64748B", fontWeight: "600" }} numberOfLines={1}>
                {listing.location}
              </Text>
              <Text style={{ color: "#CBD5E1", fontSize: 11 }}>•</Text>
              <Text style={{ fontSize: 11, color: colors.primary, fontWeight: "800" }}>{listing.distance}</Text>
            </View>
          </View>

          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <View style={{ borderRadius: 999, backgroundColor: "#EEF2FF", paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ fontSize: 10, color: "#334155", fontWeight: "700" }}>{beds} Bed</Text>
              </View>
              <View style={{ borderRadius: 999, backgroundColor: "#F1F5F9", paddingHorizontal: 8, paddingVertical: 4 }}>
                <Text style={{ fontSize: 10, color: "#334155", fontWeight: "700" }}>{baths} Bath</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
              {showVerified ? <TrustBadge label="Verified" compact /> : null}
              {showSecureChat ? <TrustBadge label="Secure Chat" compact /> : null}
              {showEscrow ? <TrustBadge label="Escrow" compact /> : null}
            </View>
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
