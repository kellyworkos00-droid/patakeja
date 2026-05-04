import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { BedDouble, Bath, CalendarDays, Camera, CheckCircle, Heart, MapPin, MessageCircle, ShieldCheck, Star } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
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
  const [saved, setSaved] = useState(false);
  const openListing = () => router.push(`/listing/${listing.id}`);
  const bookViewing = () => router.push(`/bookings/create?listingId=${listing.id}`);
  const openChat = () => router.push(`/chat/${listing.id}`);
  const cardPhotos = listing.photos;

  if (compact || variant === "explore") {
    const showVerified = isExploreListing(listing) ? listing.verified : true;
    const showEscrow = isExploreListing(listing) ? listing.escrowAvailable : true;
    const showSecureChat = isExploreListing(listing) ? listing.secureChat : true;
    const beds = isExploreListing(listing) ? listing.bedrooms : listing.beds;
    const baths = isExploreListing(listing) ? listing.bathrooms : listing.baths;

    return (
      <Pressable
        onPress={openListing}
        style={({ pressed }) => ({
          flexDirection: "row",
          gap: 12,
          borderRadius: 22,
          backgroundColor: "#FFFFFF",
          padding: 10,
          opacity: pressed ? 0.9 : 1,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.1,
          shadowRadius: 18,
          elevation: 8,
        })}
      >
        {/* Image */}
        <View style={{ position: "relative", width: 110, height: 110 }}>
          <Image
            source={listing.image as number}
            style={{ width: 110, height: 110, borderRadius: 16 }}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(15,23,42,0.55)"]}
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 55, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 }}
          />
          {/* Photo count */}
          {cardPhotos > 0 && (
            <View style={{
              position: "absolute", left: 7, bottom: 7,
              flexDirection: "row", alignItems: "center", gap: 3,
              borderRadius: 8, backgroundColor: "rgba(0,0,0,0.5)",
              paddingHorizontal: 6, paddingVertical: 3,
            }}>
              <Camera color="#fff" size={10} />
              <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{cardPhotos}</Text>
            </View>
          )}
          {/* Verified badge on image */}
          {showVerified && (
            <View style={{
              position: "absolute", top: 7, left: 7,
              backgroundColor: "#16A34A", borderRadius: 6,
              paddingHorizontal: 5, paddingVertical: 2,
              flexDirection: "row", alignItems: "center", gap: 3,
            }}>
              <CheckCircle size={9} color="#fff" strokeWidth={2.5} />
              <Text style={{ fontSize: 9, color: "#fff", fontWeight: "800" }}>VERIFIED</Text>
            </View>
          )}
          {/* Heart */}
          <Pressable
            onPress={() => setSaved((s) => !s)}
            style={{
              position: "absolute", top: 7, right: 7,
              width: 26, height: 26, borderRadius: 13,
              backgroundColor: "rgba(255,255,255,0.95)",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <Heart size={13} color={saved ? "#EF4444" : "#94A3B8"} fill={saved ? "#EF4444" : "transparent"} strokeWidth={2.2} />
          </Pressable>
        </View>

        {/* Content */}
        <View style={{ flex: 1, justifyContent: "space-between", paddingVertical: 2 }}>
          {/* Price + Rating */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 15, fontWeight: "900", color: "#0F172A", letterSpacing: -0.3 }}>
                {listing.price}
              </Text>
              <Text style={{ fontSize: 10, fontWeight: "600", color: "#94A3B8", marginTop: 1 }}>/month</Text>
            </View>
            <View style={{
              flexDirection: "row", alignItems: "center", gap: 3,
              backgroundColor: "#FEF3C7", borderRadius: 7,
              paddingHorizontal: 6, paddingVertical: 3,
            }}>
              <Star size={11} color="#F59E0B" fill="#F59E0B" />
              <Text style={{ fontSize: 11, fontWeight: "800", color: "#92400E" }}>4.8</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E293B", marginTop: 4 }} numberOfLines={1}>
            {listing.title}
          </Text>

          {/* Location */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 }}>
            <MapPin color="#16A34A" size={11} strokeWidth={2.5} />
            <Text style={{ fontSize: 11, color: "#64748B", fontWeight: "600", flex: 1 }} numberOfLines={1}>
              {listing.location}
            </Text>
            <Text style={{ fontSize: 11, color: "#16A34A", fontWeight: "700" }}>{listing.distance}</Text>
          </View>

          {/* Beds / Baths */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 7 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#EEF2FF", borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4 }}>
              <BedDouble size={11} color="#6366F1" strokeWidth={2} />
              <Text style={{ fontSize: 10, color: "#4338CA", fontWeight: "700" }}>{beds} Bed</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#F1F5F9", borderRadius: 8, paddingHorizontal: 7, paddingVertical: 4 }}>
              <Bath size={11} color="#475569" strokeWidth={2} />
              <Text style={{ fontSize: 10, color: "#334155", fontWeight: "700" }}>{baths} Bath</Text>
            </View>
          </View>

          {/* Trust badges */}
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 7 }}>
            {showVerified && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#DCFCE7", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 }}>
                <CheckCircle size={9} color="#16A34A" strokeWidth={2.5} />
                <Text style={{ fontSize: 9, color: "#15803D", fontWeight: "700" }}>Verified</Text>
              </View>
            )}
            {showSecureChat && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#FEF3C7", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 }}>
                <MessageCircle size={9} color="#D97706" strokeWidth={2.5} />
                <Text style={{ fontSize: 9, color: "#B45309", fontWeight: "700" }}>Secure Chat</Text>
              </View>
            )}
            {showEscrow && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "#FEF3C7", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 3 }}>
                <ShieldCheck size={9} color="#D97706" strokeWidth={2.5} />
                <Text style={{ fontSize: 9, color: "#B45309", fontWeight: "700" }}>Escrow</Text>
              </View>
            )}
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
