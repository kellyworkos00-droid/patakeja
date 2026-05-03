import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { colors } from "@/constants/colors";

interface MapPriceMarkerProps {
  price: string;
  selected: boolean;
  onPress: () => void;
}

export function MapPriceMarker({ price, selected, onPress }: MapPriceMarkerProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1.12 : 1,
      friction: 7,
      tension: 95,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  return (
    <Pressable onPress={onPress} style={{ alignItems: "center" }}>
      <Animated.View
        style={{
          transform: [{ scale }],
          backgroundColor: selected ? colors.primary : "#FFFFFF",
          borderWidth: selected ? 0 : 2,
          borderColor: colors.primary,
          borderRadius: 999,
          minWidth: selected ? 96 : 88,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: selected ? 16 : 14,
          paddingVertical: selected ? 10 : 8,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: selected ? 7 : 4 },
          shadowOpacity: selected ? 0.26 : 0.16,
          shadowRadius: selected ? 13 : 8,
          elevation: selected ? 11 : 6,
        }}
      >
        <Text
          style={{
            fontSize: selected ? 15 : 13,
            fontWeight: "800",
            color: selected ? "#FFFFFF" : "#0F172A",
            letterSpacing: -0.25,
          }}
        >
          {price}
        </Text>
      </Animated.View>
      {/* Caret pointer */}
      <View
        style={{
          marginTop: -2,
          width: 0,
          height: 0,
          borderLeftWidth: selected ? 7 : 6,
          borderRightWidth: selected ? 7 : 6,
          borderTopWidth: selected ? 9 : 8,
          borderStyle: "solid",
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: selected ? colors.primary : "#FFFFFF",
        }}
      />
    </Pressable>
  );
}
