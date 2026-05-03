import type { ComponentType } from "react";
import { Pressable, Text, View } from "react-native";
import { colors } from "@/constants/colors";

type CategoryChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  icon?: ComponentType<{ color: string; size: number; strokeWidth?: number }>;
};

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 10,
  elevation: 4,
};

export function CategoryChip({ label, active, onPress, icon: Icon }: CategoryChipProps) {
  const contentColor = active ? "#FFFFFF" : colors.navy;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: 44,
          borderRadius: 22,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 14,
          gap: 6,
          backgroundColor: active ? colors.navy : "#FFFFFF",
          borderWidth: active ? 0 : 1,
          borderColor: "#E2E8F0",
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        !active ? shadow : undefined,
      ]}
    >
      {Icon ? <Icon color={contentColor} size={14} strokeWidth={2} /> : null}
      <Text style={{ fontSize: 14, fontWeight: "700", color: contentColor }}>{label}</Text>
    </Pressable>
  );
}
