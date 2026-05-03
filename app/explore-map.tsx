import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowLeft,
  LayoutList,
  LocateFixed,
  MapPin,
} from "lucide-react-native";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { mapListings } from "@/data/mockMapListings";
import { FloatingMapSearchBar } from "@/components/map/FloatingMapSearchBar";
import { MapControlButton } from "@/components/map/MapControlButton";
import { MapListingBottomSheet, SHEET_COLLAPSED_HEIGHT } from "@/components/map/MapListingBottomSheet";
import { MapPriceMarker } from "@/components/map/MapPriceMarker";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

/** Floating controls sit above the collapsed sheet */
const CONTROLS_BOTTOM = SHEET_COLLAPSED_HEIGHT + 16;

export default function ExploreMapScreen() {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  // Animate map vertical offset slightly when sheet expands (simulate pan-up)
  const mapShift = useRef(new Animated.Value(0)).current;

  const handleSelectMarker = useCallback(
    (id: string) => {
      setSelectedId(id);
      setSheetExpanded(true);
      Animated.spring(mapShift, {
        toValue: id ? -40 : 0,
        friction: 8,
        tension: 50,
        useNativeDriver: true,
      }).start();
    },
    [mapShift]
  );

  const handleExpandChange = useCallback(
    (expanded: boolean) => {
      setSheetExpanded(expanded);
      if (!expanded) {
        Animated.spring(mapShift, {
          toValue: 0,
          friction: 8,
          tension: 50,
          useNativeDriver: true,
        }).start();
      }
    },
    [mapShift]
  );

  const handleNearMe = () => {
    // expo-location would be used here in production:
    // const { status } = await Location.requestForegroundPermissionsAsync();
    // if (status === "granted") { const loc = await Location.getCurrentPositionAsync({}); ... }
    Alert.alert(
      "Near Me",
      "Showing rentals within 5 km of your location.",
      [{ text: "OK", style: "default" }]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0F172A" }}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />

      {/* ─── Full-screen map background ─── */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          transform: [{ translateY: mapShift }],
        }}
      >
        <Image
          source={images.exploreDirection}
          style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT + 80 }}
          resizeMode="cover"
        />
        {/* Subtle vignette overlay */}
        <LinearGradient
          colors={["rgba(15,23,42,0.18)", "rgba(15,23,42,0)", "rgba(15,23,42,0)", "rgba(15,23,42,0.35)"]}
          locations={[0, 0.15, 0.7, 1]}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        />
      </Animated.View>

      {/* ─── Price markers ─── */}
      {mapListings.map((listing) => (
        <View
          key={listing.id}
          style={{
            position: "absolute",
            left: listing.markerX as any,
            top: listing.markerY as any,
            transform: [{ translateX: -30 }, { translateY: -20 }],
          }}
          pointerEvents="box-none"
        >
          <MapPriceMarker
            price={listing.price}
            selected={selectedId === listing.id}
            onPress={() => handleSelectMarker(listing.id)}
          />
        </View>
      ))}

      {/* ─── Top bar ─── */}
      <View
        style={{
          position: "absolute",
          top: insets.top + 10,
          left: 16,
          right: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.85 : 1,
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.13,
            shadowRadius: 12,
            elevation: 8,
          })}
        >
          <ArrowLeft size={18} color="#0F172A" strokeWidth={2.4} />
        </Pressable>

        {/* Search bar */}
        <View style={{ flex: 1 }}>
          <FloatingMapSearchBar />
        </View>
      </View>

      {/* ─── Area badge ─── */}
      {selectedId && (
        <View
          style={{
            position: "absolute",
            top: insets.top + 70,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
          pointerEvents="none"
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "rgba(255,255,255,0.92)",
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 7,
              shadowColor: "#0F172A",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <MapPin size={13} color={colors.primary} />
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#0F172A" }}>
              {mapListings.find((l) => l.id === selectedId)?.area}, Nairobi
            </Text>
          </View>
        </View>
      )}

      {/* ─── Floating controls (right side) ─── */}
      <View
        style={{
          position: "absolute",
          right: 16,
          bottom: CONTROLS_BOTTOM + 10,
          gap: 12,
          alignItems: "center",
        }}
      >
        {/* Near Me */}
        <MapControlButton
          variant="circle"
          icon={<LocateFixed size={20} color={colors.primary} strokeWidth={2.2} />}
          onPress={handleNearMe}
        />
      </View>

      {/* ─── View List pill (bottom centre above sheet) ─── */}
      <View
        style={{
          position: "absolute",
          bottom: CONTROLS_BOTTOM + 10,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
        pointerEvents="box-none"
      >
        <MapControlButton
          variant="pill"
          icon={<LayoutList size={16} color="#0F172A" strokeWidth={2.2} />}
          label="View List"
          onPress={() => router.back()}
        />
      </View>

      {/* ─── Bottom sheet ─── */}
      <MapListingBottomSheet
        listings={mapListings}
        selectedId={selectedId}
        onSelectListing={handleSelectMarker}
        isExpanded={sheetExpanded}
        onExpandChange={handleExpandChange}
        tabBarHeight={0}
      />
    </View>
  );
}
