import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  Check,
  Star,
  MapPin,
  CalendarDays,
  Shield,
  ChevronRight,
  Flag,
  MessageCircle,
  Bed,
  Bath,
  Car,
  Verified,
} from "lucide-react-native";
import { chats } from "@/data/mockChats";
import { listings } from "@/data/mockListings";

// ── Mock profile data keyed by userId ──────────────────────────────

const PROFILES: Record<
  string,
  { joinDate: string; reviewCount: number; rating: number; responseRate: string; bio: string; listingIds: string[] }
> = {
  u1: { joinDate: "Member since Jan 2022", reviewCount: 47, rating: 4.9, responseRate: "97%", bio: "Professional landlord with properties across Nairobi. I believe in transparent pricing and well-maintained homes.", listingIds: ["1"] },
  u2: { joinDate: "Member since Mar 2023", reviewCount: 28, rating: 4.7, responseRate: "92%", bio: "I manage several properties in Westlands. Quick viewings, fair deposits.", listingIds: ["2"] },
  u3: { joinDate: "Member since Aug 2021", reviewCount: 19, rating: 4.5, responseRate: "88%", bio: "Honest landlord. All my units are verified and utilities are included.", listingIds: ["3"] },
  u4: { joinDate: "Member since Jun 2022", reviewCount: 34, rating: 4.8, responseRate: "95%", bio: "Lavington properties. Family-friendly compounds, 24/7 security.", listingIds: ["1", "3"] },
  u5: { joinDate: "Member since Dec 2022", reviewCount: 12, rating: 4.6, responseRate: "90%", bio: "First-time lister, serious about tenant comfort.", listingIds: ["2"] },
  u6: { joinDate: "Member since Sep 2020", reviewCount: 56, rating: 4.9, responseRate: "99%", bio: "Seasoned property manager with 6 years experience across Nairobi south.", listingIds: ["3"] },
  u7: { joinDate: "Member since Feb 2021", reviewCount: 31, rating: 4.7, responseRate: "93%", bio: "Karen specialist. Premium homes, verified tenants only.", listingIds: ["1"] },
};

function VerifiedBadge() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#DCFCE7", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
      <Check size={12} color="#16A34A" strokeWidth={3} />
      <Text style={{ fontSize: 12, fontWeight: "700", color: "#16A34A" }}>Verified Host</Text>
    </View>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} color="#F59E0B" fill={i <= Math.round(rating) ? "#F59E0B" : "transparent"} strokeWidth={2} />
      ))}
      <Text style={{ fontSize: 14, fontWeight: "700", color: "#0F172A", marginLeft: 2 }}>{rating.toFixed(1)}</Text>
    </View>
  );
}

function ListingCard({ listing, onPress }: { listing: (typeof listings)[0]; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "#F8FAFC" : "#FFFFFF",
        borderRadius: 18, borderWidth: 1, borderColor: "#EDF2F7",
        marginBottom: 12, overflow: "hidden",
        shadowColor: "#0F172A", shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
      })}
    >
      <Image source={listing.image} style={{ width: "100%", height: 160, borderTopLeftRadius: 17, borderTopRightRadius: 17 }} resizeMode="cover" />
      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <View style={{ backgroundColor: "#DCFCE7", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 }}>
            <Text style={{ fontSize: 10, fontWeight: "700", color: "#16A34A", letterSpacing: 0.5 }}>VERIFIED</Text>
          </View>
          <Text style={{ fontSize: 17, fontWeight: "800", color: "#16A34A" }}>
            {listing.price} <Text style={{ fontSize: 12, fontWeight: "500", color: "#94A3B8" }}>/mo</Text>
          </Text>
        </View>
        <Text style={{ fontSize: 15, fontWeight: "700", color: "#0F172A", marginBottom: 4 }} numberOfLines={1}>{listing.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 10 }}>
          <MapPin size={12} color="#64748B" />
          <Text style={{ fontSize: 12.5, color: "#64748B" }}>{listing.location}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 14 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Bed size={14} color="#94A3B8" strokeWidth={2} />
            <Text style={{ fontSize: 13, color: "#64748B" }}>{listing.beds} bed</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Bath size={14} color="#94A3B8" strokeWidth={2} />
            <Text style={{ fontSize: 13, color: "#64748B" }}>{listing.baths} bath</Text>
          </View>
          {listing.parking && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Car size={14} color="#94A3B8" strokeWidth={2} />
              <Text style={{ fontSize: 13, color: "#64748B" }}>Parking</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function UserProfileScreen() {
  const { id: userId, chatId } = useLocalSearchParams<{ id: string; chatId?: string }>();

  // Find chat thread matching this userId to get name, avatar etc.
  const thread = chats.find((c) => c.userId === userId);
  const profile = PROFILES[userId] ?? PROFILES["u1"];

  if (!thread) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#94A3B8", fontSize: 16 }}>Profile not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const userListings = listings.filter((l) => profile.listingIds.includes(l.id));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F4F8FB" }} edges={["top"]}>

      {/* ── Header ── */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#F1F5F9", gap: 10 }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#F4F8FB", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={18} color="#0F172A" strokeWidth={2.5} />
        </Pressable>
        <Text style={{ flex: 1, fontSize: 17, fontWeight: "800", color: "#0F172A" }}>Host Profile</Text>
        <Pressable
          onPress={() => Alert.alert("Report User", "Are you sure you want to report this user?", [
            { text: "Cancel", style: "cancel" },
            { text: "Report", style: "destructive", onPress: () => router.push("/safety/report" as any) },
          ])}
          style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, height: 36, borderRadius: 18, backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA" }}
        >
          <Flag size={14} color="#EF4444" strokeWidth={2} />
          <Text style={{ fontSize: 13, color: "#EF4444", fontWeight: "600" }}>Report</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Profile Card ── */}
        <View style={{ backgroundColor: "#FFFFFF", paddingHorizontal: 20, paddingVertical: 28, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#F1F5F9" }}>
          {/* Avatar */}
          <View style={{ position: "relative", marginBottom: 14 }}>
            <View style={{ width: 90, height: 90, borderRadius: 45, backgroundColor: thread.avatarColor, alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "#FFFFFF", shadowColor: "#0F172A", shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 }}>
              <Text style={{ color: "white", fontSize: 32, fontWeight: "800", letterSpacing: 1 }}>{thread.initials}</Text>
            </View>
            {thread.online && (
              <View style={{ position: "absolute", bottom: 3, right: 3, width: 18, height: 18, borderRadius: 9, backgroundColor: "#16A34A", borderWidth: 3, borderColor: "#FFFFFF" }} />
            )}
          </View>

          <Text style={{ fontSize: 22, fontWeight: "900", color: "#0F172A", letterSpacing: -0.3, marginBottom: 6 }}>{thread.name}</Text>
          {thread.verified && <VerifiedBadge />}
          <Text style={{ fontSize: 13, color: "#64748B", marginTop: 8 }}>{profile.joinDate}</Text>

          {/* Stats Row */}
          <View style={{ flexDirection: "row", marginTop: 20, gap: 0, width: "100%", backgroundColor: "#F4F8FB", borderRadius: 18, overflow: "hidden" }}>
            {[
              { label: "Rating", value: `${profile.rating}` },
              { label: "Reviews", value: `${profile.reviewCount}` },
              { label: "Response", value: profile.responseRate },
              { label: "Listings", value: `${userListings.length}` },
            ].map((stat, i) => (
              <View key={stat.label} style={{ flex: 1, alignItems: "center", paddingVertical: 14, borderRightWidth: i < 3 ? 1 : 0, borderRightColor: "#E2E8F0" }}>
                <Text style={{ fontSize: 18, fontWeight: "900", color: "#0F172A" }}>{stat.value}</Text>
                <Text style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Star Rating */}
          <View style={{ marginTop: 16 }}>
            <StarRating rating={profile.rating} />
          </View>

          {/* Bio */}
          <View style={{ marginTop: 16, backgroundColor: "#F8FAFC", borderRadius: 16, padding: 14, width: "100%", borderWidth: 1, borderColor: "#EDF2F7" }}>
            <Text style={{ fontSize: 14, color: "#475569", lineHeight: 22, textAlign: "center" }}>{profile.bio}</Text>
          </View>

          {/* Response time badge */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 14, backgroundColor: "#F0FDF4", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#BBF7D0" }}>
            <Shield size={13} color="#16A34A" />
            <Text style={{ fontSize: 13, color: "#15803D", fontWeight: "600" }}>{thread.responseTime}</Text>
          </View>
        </View>

        {/* ── Actions ── */}
        <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 16, marginTop: 14 }}>
          {chatId && (
            <Pressable
              onPress={() => router.push(`/chat/${chatId}` as any)}
              style={({ pressed }) => ({ flex: 1, height: 48, borderRadius: 16, backgroundColor: pressed ? "#15803D" : "#16A34A", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 })}
            >
              <MessageCircle size={18} color="#FFFFFF" strokeWidth={2} />
              <Text style={{ color: "#FFFFFF", fontSize: 15, fontWeight: "700" }}>Message</Text>
            </Pressable>
          )}
          <Pressable
            onPress={() => router.push(`/bookings/create` as any)}
            style={({ pressed }) => ({ flex: 1, height: 48, borderRadius: 16, backgroundColor: pressed ? "#F8FAFC" : "#FFFFFF", borderWidth: 1.5, borderColor: "#E2E8F0", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 })}
          >
            <CalendarDays size={18} color="#0F172A" strokeWidth={2} />
            <Text style={{ color: "#0F172A", fontSize: 15, fontWeight: "700" }}>Book Viewing</Text>
          </Pressable>
        </View>

        {/* ── Listings ── */}
        {userListings.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 22 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <Text style={{ fontSize: 18, fontWeight: "900", color: "#0F172A", letterSpacing: -0.3 }}>
                {thread.name.split(" ")[0]}'s Listings
              </Text>
              <Text style={{ fontSize: 13, color: "#94A3B8" }}>{userListings.length} active</Text>
            </View>
            {userListings.map((l) => (
              <ListingCard key={l.id} listing={l} onPress={() => router.push(`/listing/${l.id}` as any)} />
            ))}
          </View>
        )}

        {/* ── Safety Note ── */}
        <View style={{ marginHorizontal: 16, marginTop: 8, padding: 14, backgroundColor: "#FFF7ED", borderRadius: 16, borderWidth: 1, borderColor: "#FED7AA", flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Shield size={18} color="#F59E0B" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#92400E", lineHeight: 18 }}>Stay safe on PataKeja</Text>
            <Text style={{ fontSize: 12, color: "#A16207", marginTop: 2, lineHeight: 17 }}>Never pay outside the app or share personal contact details.</Text>
          </View>
          <Pressable>
            <ChevronRight size={16} color="#F59E0B" strokeWidth={2.5} />
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
