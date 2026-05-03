import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Check, ChevronDown } from "lucide-react-native";
import { colors } from "@/constants/colors";

type SortOption = "Newest" | "Price: Low to High" | "Price: High to Low" | "Distance";

type SortDropdownProps = {
  value: SortOption;
  onChange: (value: SortOption) => void;
};

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.1,
  shadowRadius: 16,
  elevation: 7,
};

const options: SortOption[] = ["Newest", "Price: Low to High", "Price: High to Low", "Distance"];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);

  const selectOption = (option: SortOption) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <View style={{ position: "relative", zIndex: 10 }}>
      <Pressable
        onPress={() => setOpen((prev) => !prev)}
        style={({ pressed }) => ({ flexDirection: "row", alignItems: "center", gap: 4, opacity: pressed ? 0.7 : 1 })}
      >
        <Text style={{ fontSize: 14, color: "#64748B", fontWeight: "600" }}>
          Sort by: <Text style={{ fontWeight: "700", color: colors.navy }}>{value}</Text>
        </Text>
        <ChevronDown color={colors.navy} size={16} strokeWidth={2.4} />
      </Pressable>

      {open ? (
        <View
          style={[
            {
              position: "absolute",
              right: 0,
              top: 44,
              backgroundColor: "#FFFFFF",
              borderRadius: 14,
              paddingVertical: 6,
              width: 198,
            },
            shadow,
          ]}
        >
          {options.map((option) => {
            const active = option === value;
            return (
              <Pressable
                key={option}
                onPress={() => selectOption(option)}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  backgroundColor: pressed ? "#F8FAFC" : "#FFFFFF",
                })}
              >
                <Text style={{ fontSize: 13, color: active ? colors.navy : "#334155", fontWeight: active ? "800" : "600" }}>{option}</Text>
                {active ? <Check size={14} color={colors.primary} /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}
