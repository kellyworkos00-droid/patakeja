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
  const elevation = useRef(new Animated.Value(selected ? 10 : 4)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1.18 : 1,
      friction: 5,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  return (
    <Pressable onPress={onPress} style={{ alignItems: "center" }}>
      <Animated.View
        style={{
          transform: [{ scale }],
          backgroundColor: selected ? colors.primary : "#FFFFFF",
          borderWidth: 2,
          borderColor: colors.primary,
          borderRadius: 24,
          paddingHorizontal: 12,
          paddingVertical: 6,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: selected ? 6 : 3 },
          shadowOpacity: selected ? 0.28 : 0.14,
          shadowRadius: selected ? 10 : 6,
          elevation: selected ? 10 : 4,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "800",
            color: selected ? "#FFFFFF" : "#0F172A",
            letterSpacing: -0.2,
          }}
        >
          {price}
        </Text>
      </Animated.View>
      {/* Caret pointer */}
      <View
        style={{
          marginTop: -1,
          width: 0,
          height: 0,
          borderLeftWidth: 5,
          borderRightWidth: 5,
          borderTopWidth: 6,
          borderStyle: "solid",
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderTopColor: selected ? colors.primary : "#FFFFFF",
        }}
      />
    </Pressable>
  );
}
