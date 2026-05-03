import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  LockKeyhole,
  MapPin,
  Navigation,
  ShieldCheck,
} from "lucide-react-native";
import { router } from "expo-router";
import { colors } from "@/constants/colors";
import type { MapListing } from "@/data/mockMapListings";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const SHEET_FULL_HEIGHT = 430;
export const SHEET_COLLAPSED_HEIGHT = 195;
const COLLAPSED_OFFSET = SHEET_FULL_HEIGHT - SHEET_COLLAPSED_HEIGHT;

const cardShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.09,
  shadowRadius: 14,
  elevation: 6,
};

function TrustBadge({ type }: { type: "Verified" | "Secure Chat" | "Escrow" }) {
  const cfg = {
    Verified: { icon: ShieldCheck, bg: "#DCFCE7", color: colors.primary },
    "Secure Chat": { icon: LockKeyhole, bg: "#FEF3C7", color: "#D97706" },
    Escrow: { icon: ShieldCheck, bg: "#EDE9FE", color: "#7C3AED" },
  }[type];
  const Icon = cfg.icon;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: cfg.bg,
        borderRadius: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <Icon size={11} color={cfg.color} strokeWidth={2.8} />
      <Text style={{ fontSize: 11, fontWeight: "700", color: cfg.color }}>{type}</Text>
    </View>
  );
}

interface MapListingBottomSheetProps {
  listings: MapListing[];
  selectedId: string | null;
  onSelectListing: (id: string) => void;
  isExpanded: boolean;
  onExpandChange: (expanded: boolean) => void;
  tabBarHeight?: number;
}

export function MapListingBottomSheet({
  listings,
  selectedId,
  onSelectListing,
  isExpanded,
  onExpandChange,
  tabBarHeight = 0,
}: MapListingBottomSheetProps) {
  const translateY = useRef(new Animated.Value(COLLAPSED_OFFSET)).current;
  const lastY = useRef(COLLAPSED_OFFSET);

  // Sync external expand state
  useEffect(() => {
    const target = isExpanded ? 0 : COLLAPSED_OFFSET;
    Animated.spring(translateY, {
      toValue: target,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start(() => {
      lastY.current = target;
    });
  }, [isExpanded]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gs) => Math.abs(gs.dy) > 4,
      onPanResponderMove: (_, gs) => {
        const next = Math.max(0, Math.min(COLLAPSED_OFFSET, lastY.current + gs.dy));
        translateY.setValue(next);
      },
      onPanResponderRelease: (_, gs) => {
        const shouldExpand = gs.dy < -30 || lastY.current + gs.dy < COLLAPSED_OFFSET / 2;
        const target = shouldExpand ? 0 : COLLAPSED_OFFSET;
        onExpandChange(shouldExpand);
        Animated.spring(translateY, {
          toValue: target,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }).start(() => {
          lastY.current = target;
        });
      },
    })
  ).current;

  const selected = listings.find((l) => l.id === selectedId) ?? listings[0];

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: tabBarHeight,
        left: 0,
        right: 0,
        height: SHEET_FULL_HEIGHT,
        transform: [{ translateY }],
        backgroundColor: "#fff",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        shadowColor: "#0F172A",
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 20,
      }}
    >
      {/* Drag handle */}
      <View {...panResponder.panHandlers} style={{ paddingTop: 12, paddingBottom: 6, alignItems: "center" }}>
        <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: "#CBD5E1" }} />
      </View>

      {/* Header row */}
      <View
        {...panResponder.panHandlers}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingBottom: 14,
        }}
      >
        <View>
          <Text style={{ fontSize: 15, fontWeight: "800", color: "#0F172A" }}>
            {listings.length} homes nearby
          </Text>
          <Text style={{ fontSize: 12, color: "#64748B", marginTop: 1 }}>Tap a pin to preview</Text>
        </View>
        <View
          style={{
            backgroundColor: "#EEF9F3",
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary }}>
            KES 15K–45K
          </Text>
        </View>
      </View>

      {/* Mini card strip (always visible) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10, paddingBottom: 4 }}
      >
        {listings.map((listing) => {
          const active = listing.id === (selectedId ?? listings[0].id);
          return (
            <Pressable
              key={listing.id}
              onPress={() => {
                onSelectListing(listing.id);
                onExpandChange(true);
              }}
              style={[
                {
                  width: 140,
                  backgroundColor: "#fff",
                  borderRadius: 16,
                  overflow: "hidden",
                  borderWidth: 2,
                  borderColor: active ? colors.primary : "#F1F5F9",
                },
                cardShadow,
              ]}
            >
              <Image
                source={listing.image}
                style={{ width: "100%", height: 80 }}
                resizeMode="cover"
              />
              <View style={{ padding: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: "800", color: "#0F172A" }} numberOfLines={1}>
                  {listing.price}
                  <Text style={{ fontSize: 10, fontWeight: "500", color: "#94A3B8" }}>/mo</Text>
                </Text>
                <Text style={{ fontSize: 11, color: "#64748B", marginTop: 1 }} numberOfLines={1}>
                  {listing.area}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Expanded detail card */}
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
        <View style={[{ flexDirection: "row", backgroundColor: "#F8FAFC", borderRadius: 20, overflow: "hidden" }, cardShadow]}>
          <Image
            source={selected.image}
            style={{ width: 110, height: 110 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1, padding: 12, justifyContent: "space-between" }}>
            <View>
              <Text style={{ fontSize: 17, fontWeight: "800", color: "#0F172A" }} numberOfLines={1}>
                {selected.price}
                <Text style={{ fontSize: 12, fontWeight: "500", color: "#94A3B8" }}> /mo</Text>
              </Text>
              <Text style={{ fontSize: 13, fontWeight: "700", color: "#0F172A", marginTop: 2 }} numberOfLines={1}>
                {selected.title}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                <MapPin size={11} color="#94A3B8" />
                <Text style={{ fontSize: 11, color: "#64748B" }}>{selected.area}</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
                <Navigation size={11} color={colors.primary} />
                <Text style={{ fontSize: 11, color: colors.primary, fontWeight: "600" }}>
                  {selected.distance}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
              {selected.verified && <TrustBadge type="Verified" />}
              <TrustBadge type="Secure Chat" />
              {selected.escrowAvailable && <TrustBadge type="Escrow" />}
            </View>
          </View>
        </View>

        {/* Action buttons */}
        <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
          <Pressable
            onPress={() => router.push(`/listing/${selected.id}`)}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 13,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: colors.primary,
              alignItems: "center",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ fontSize: 13, fontWeight: "800", color: colors.primary }}>View Details</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/bookings/create")}
            style={({ pressed }) => ({
              flex: 1,
              paddingVertical: 13,
              borderRadius: 16,
              backgroundColor: colors.primary,
              alignItems: "center",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ fontSize: 13, fontWeight: "800", color: "#fff" }}>Book Viewing</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
