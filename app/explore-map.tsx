import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  ArrowLeft,
  LayoutList,
  LocateFixed,
  MapPin,
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { mapListings } from "@/data/mockMapListings";
import { FloatingMapSearchBar } from "@/components/map/FloatingMapSearchBar";
import { MapControlButton } from "@/components/map/MapControlButton";
import { MapListingBottomSheet, SHEET_COLLAPSED_HEIGHT } from "@/components/map/MapListingBottomSheet";
import { MapPriceMarker } from "@/components/map/MapPriceMarker";

const INITIAL_REGION: Region = {
  latitude: -1.286389,
  longitude: 36.817223,
  latitudeDelta: 0.19,
  longitudeDelta: 0.12,
};

const lightMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#f2f5f7" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#5b6472" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#ffffff" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#dde5eb" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#dceef9" }] },
];

/** Floating controls sit above the collapsed sheet */
const CONTROLS_BOTTOM = SHEET_COLLAPSED_HEIGHT + 16;

export default function ExploreMapScreen() {
  const insets = useSafeAreaInsets();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetExpanded, setSheetExpanded] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  const sheetProgress = useRef(new Animated.Value(1)).current;

  const selectedListing = useMemo(
    () => mapListings.find((listing) => listing.id === selectedId) ?? null,
    [selectedId]
  );

  const centerMap = useCallback((latitude: number, longitude: number, zoomed = true) => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: zoomed ? 0.06 : 0.12,
        longitudeDelta: zoomed ? 0.04 : 0.08,
      },
      380
    );
  }, []);

  const handleSelectMarker = useCallback(
    (id: string) => {
      setSelectedId(id);
      setSheetExpanded(true);
      const target = mapListings.find((item) => item.id === id);
      if (target) {
        centerMap(target.latitude, target.longitude, true);
      }
    },
    [centerMap]
  );

  const handleExpandChange = useCallback(
    (expanded: boolean) => {
      setSheetExpanded(expanded);
    },
    []
  );

  const handleNearMe = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location needed", "Enable location permission to center the map around you.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      centerMap(location.coords.latitude, location.coords.longitude, true);
    } catch {
      Alert.alert("Could not get location", "Please try again after checking GPS and app permissions.");
    }
  }, [centerMap]);

  const controlsOpacity = sheetProgress.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0.35, 0.7, 1],
    extrapolate: "clamp",
  });

  const controlsTranslateY = sheetProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 0],
    extrapolate: "clamp",
  });

  const stickyBandOpacity = sheetProgress.interpolate({
    inputRange: [1, 0.5, 0],
    outputRange: [0, 0.62, 1],
    extrapolate: "clamp",
  });

  const stickyBandTranslateY = sheetProgress.interpolate({
    inputRange: [1, 0],
    outputRange: [10, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <MapView
        ref={mapRef}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        initialRegion={INITIAL_REGION}
        customMapStyle={lightMapStyle}
        mapType="standard"
        showsCompass={false}
        showsScale={false}
        showsMyLocationButton={false}
      >
        {mapListings.map((listing) => (
          <Marker
            key={listing.id}
            coordinate={{ latitude: listing.latitude, longitude: listing.longitude }}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}
            onPress={() => handleSelectMarker(listing.id)}
          >
            <MapPriceMarker
              price={listing.price}
              selected={selectedId === listing.id}
              onPress={() => handleSelectMarker(listing.id)}
            />
          </Marker>
        ))}
      </MapView>

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
      {selectedListing && (
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
              {selectedListing.area}, {selectedListing.city}
            </Text>
          </View>
        </View>
      )}

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: insets.top + 74,
          left: 0,
          right: 0,
          alignItems: "center",
          opacity: stickyBandOpacity,
          transform: [{ translateY: stickyBandTranslateY }],
        }}
      >
        <View
          style={{
            borderRadius: 999,
            backgroundColor: "rgba(255,255,255,0.96)",
            borderWidth: 1,
            borderColor: "#DCFCE7",
            paddingHorizontal: 12,
            paddingVertical: 6,
            shadowColor: "#0F172A",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.12,
            shadowRadius: 10,
            elevation: 6,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: "800", color: colors.primary }}>
            {selectedListing ? `${selectedListing.price} • ${selectedListing.area}` : "KES 15K–45K"}
          </Text>
        </View>
      </Animated.View>

      {/* ─── Floating controls (right side) ─── */}
      <Animated.View
        style={{
          position: "absolute",
          right: 16,
          bottom: CONTROLS_BOTTOM + 10,
          gap: 12,
          alignItems: "center",
          opacity: controlsOpacity,
          transform: [{ translateY: controlsTranslateY }],
        }}
      >
        {/* Near Me */}
        <MapControlButton
          variant="circle"
          icon={<LocateFixed size={20} color={colors.primary} strokeWidth={2.2} />}
          onPress={handleNearMe}
        />
      </Animated.View>

      {/* ─── View List pill (bottom centre above sheet) ─── */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: CONTROLS_BOTTOM + 10,
          left: 0,
          right: 0,
          alignItems: "center",
          opacity: controlsOpacity,
          transform: [{ translateY: controlsTranslateY }],
        }}
        pointerEvents="box-none"
      >
        <MapControlButton
          variant="pill"
          icon={<LayoutList size={16} color="#0F172A" strokeWidth={2.2} />}
          label="View List"
          onPress={() => router.back()}
        />
      </Animated.View>

      {/* ─── Bottom sheet ─── */}
      <MapListingBottomSheet
        listings={mapListings}
        selectedId={selectedId}
        onSelectListing={handleSelectMarker}
        isExpanded={sheetExpanded}
        onExpandChange={handleExpandChange}
        onPositionChange={(progress) => sheetProgress.setValue(progress)}
        tabBarHeight={0}
      />
    </View>
  );
}
