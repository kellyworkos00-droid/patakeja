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
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.1,
  shadowRadius: 16,
  elevation: 7,
};

export function FloatingSearchBar({
  placeholder = "Search location, area or property...",
  onPress,
  onFilterPress,
}: FloatingSearchBarProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          backgroundColor: "#FFFFFF",
          borderRadius: 24,
          paddingHorizontal: 16,
          paddingVertical: 15,
          marginHorizontal: 20,
        },
        shadow,
      ]}
    >
      <Search color={colors.primary} size={20} strokeWidth={2.4} />
      <Text style={{ flex: 1, fontSize: 16, color: "#64748B", fontWeight: "500" }} numberOfLines={1}>
        {placeholder}
      </Text>

      <View style={{ width: 1, height: 24, backgroundColor: "#E2E8F0" }} />
      <Pressable onPress={onFilterPress} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <SlidersHorizontal size={16} color={colors.navy} />
        <Text style={{ fontSize: 14, fontWeight: "700", color: colors.navy }}>Filters</Text>
      </Pressable>
    </Pressable>
  );
}
