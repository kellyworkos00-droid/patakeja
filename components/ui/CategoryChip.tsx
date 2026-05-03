import { Pressable, Text } from "react-native";
import { colors } from "@/constants/colors";

type CategoryChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.07,
  shadowRadius: 10,
  elevation: 4,
};

export function CategoryChip({ label, active, onPress }: CategoryChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          height: 44,
          borderRadius: 22,
          justifyContent: "center",
          paddingHorizontal: 16,
          backgroundColor: active ? colors.navy : "#FFFFFF",
        },
        !active ? shadow : undefined,
      ]}
    >
      <Text style={{ fontSize: 14, fontWeight: "700", color: active ? "#FFFFFF" : colors.navy }}>{label}</Text>
    </Pressable>
  );
}
