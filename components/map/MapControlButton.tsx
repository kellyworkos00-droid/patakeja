import React from "react";
import { Pressable, Text } from "react-native";
import { colors } from "@/constants/colors";

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.15,
  shadowRadius: 14,
  elevation: 8,
};

interface MapControlButtonProps {
  icon: React.ReactNode;
  label?: string;
  onPress: () => void;
  variant?: "circle" | "pill";
  active?: boolean;
}

export function MapControlButton({
  icon,
  label,
  onPress,
  variant = "circle",
  active = false,
}: MapControlButtonProps) {
  const bg = active ? colors.primary : "#fff";
  const textColor = active ? "#fff" : "#0F172A";

  if (variant === "pill") {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          {
            flexDirection: "row",
            alignItems: "center",
            gap: 7,
            backgroundColor: bg,
            borderRadius: 30,
            paddingHorizontal: 20,
            paddingVertical: 13,
            opacity: pressed ? 0.85 : 1,
          },
          shadow,
        ]}
      >
        {icon}
        {label && (
          <Text style={{ fontSize: 13, fontWeight: "800", color: textColor }}>
            {label}
          </Text>
        )}
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.85 : 1,
        },
        shadow,
      ]}
    >
      {icon}
    </Pressable>
  );
}
