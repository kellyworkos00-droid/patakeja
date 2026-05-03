import { Pressable, Text, View } from "react-native";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { colors } from "@/constants/colors";

type FloatingSearchBarProps = {
  placeholder?: string;
  onPress?: () => void;
  onFilterPress?: () => void;
};

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.12,
  shadowRadius: 18,
  elevation: 8,
};

export function FloatingSearchBar({
  placeholder = "Search location, area or property...",
  onPress,
  onFilterPress,
}: FloatingSearchBarProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#FFFFFF",
          borderRadius: 24,
          borderWidth: 1,
          borderColor: "#E2E8F0",
          paddingHorizontal: 16,
          paddingVertical: 15,
          marginHorizontal: 20,
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
        shadow,
      ]}
    >
      <Search color={colors.primary} size={20} strokeWidth={2.4} />
      <Text style={{ flex: 1, fontSize: 16, color: "#64748B", fontWeight: "600" }} numberOfLines={1}>
        {placeholder}
      </Text>

      <View style={{ width: 1, height: 24, backgroundColor: "#E2E8F0" }} />
      <Pressable onPress={onFilterPress} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <SlidersHorizontal size={16} color={colors.navy} />
        <Text style={{ fontSize: 14, fontWeight: "800", color: colors.navy }}>Filters</Text>
      </Pressable>
    </Pressable>
  );
}
