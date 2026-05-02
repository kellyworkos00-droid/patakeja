import { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { colors } from "@/constants/colors";

type FloatingHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: ReactNode;
};

export function FloatingHeader({ title, subtitle, showBack = true, right }: FloatingHeaderProps) {
  return (
    <View className="mb-5 mt-2 flex-row items-center gap-4">
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          className="h-11 w-11 items-center justify-center rounded-full bg-white"
        >
          <ArrowLeft color={colors.navy} size={23} />
        </Pressable>
      ) : null}
      <View className="flex-1">
        <Text className="text-3xl font-extrabold text-navy">{title}</Text>
        {subtitle ? <Text className="mt-1 text-base text-navy/60">{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}
