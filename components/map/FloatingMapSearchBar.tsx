import React from "react";
import { Pressable, Text, View } from "react-native";
import { Search, SlidersHorizontal } from "lucide-react-native";
import { router } from "expo-router";
import { colors } from "@/constants/colors";

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.13,
  shadowRadius: 18,
  elevation: 10,
};

interface FloatingMapSearchBarProps {
  onFilterPress?: () => void;
}

export function FloatingMapSearchBar({ onFilterPress }: FloatingMapSearchBarProps) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Pressable
        onPress={() => router.push("/search")}
        style={({ pressed }) => [
          {
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: "#fff",
            borderRadius: 30,
            paddingHorizontal: 18,
            paddingVertical: 14,
            opacity: pressed ? 0.92 : 1,
          },
          shadow,
        ]}
      >
        <Search size={17} color={colors.primary} strokeWidth={2.5} />
        <Text style={{ flex: 1, fontSize: 14, color: "#94A3B8", fontWeight: "500" }}>
          Search area or home
        </Text>
        <View style={{ width: 1, height: 20, backgroundColor: "#E2E8F0" }} />
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Search size={13} color="#fff" strokeWidth={2.5} />
        </View>
      </Pressable>

      <Pressable
        onPress={onFilterPress}
        style={({ pressed }) => [
          {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.88 : 1,
          },
          shadow,
        ]}
      >
        <SlidersHorizontal size={18} color="#0F172A" strokeWidth={2.2} />
        <View
          style={{
            position: "absolute",
            top: 11,
            right: 11,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.primary,
            borderWidth: 1.5,
            borderColor: "#fff",
          }}
        />
      </Pressable>
    </View>
  );
}
