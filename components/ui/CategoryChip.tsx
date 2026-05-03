import { Pressable, Text } from "react-native";
import { colors } from "@/constants/colors";

type CategoryChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 14,
  elevation: 5,
};

export function CategoryChip({ label, active, onPress }: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          height: 44,
          borderRadius: 22,
          justifyContent: "center",
          paddingHorizontal: 16,
          backgroundColor: active ? colors.navy : "#FFFFFF",
          borderWidth: active ? 0 : 1,
          borderColor: "#E2E8F0",
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        !active ? shadow : undefined,
      ]}
    >
      <Text style={{ fontSize: 14, fontWeight: "700", color: active ? "#FFFFFF" : colors.navy }}>{label}</Text>
    </Pressable>
  );
}
