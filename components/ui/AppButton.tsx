import { ReactNode } from "react";
import { ActivityIndicator, Pressable, Text, ViewStyle } from "react-native";
import { colors } from "@/constants/colors";

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  full?: boolean;
  style?: ViewStyle;
};

const variantClasses = {
  primary: "bg-primary",
  secondary: "bg-navy",
  outline: "border border-primary bg-white",
  ghost: "bg-white",
  danger: "bg-[#EF4444]",
};

const textClasses = {
  primary: "text-white",
  secondary: "text-white",
  outline: "text-primary",
  ghost: "text-navy",
  danger: "text-white",
};

const sizeClasses = {
  sm: "h-10 px-4",
  md: "h-12 px-5",
  lg: "h-14 px-6",
};

export function AppButton({
  title,
  onPress,
  variant = "primary",
  size = "md",
  icon,
  disabled,
  loading,
  full,
  style,
}: AppButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      onPress={onPress}
      className={`${sizeClasses[size]} ${variantClasses[variant]} ${
        full ? "w-full" : ""
      } flex-row items-center justify-center gap-2 rounded-2xl ${disabled ? "opacity-50" : ""}`}
      style={({ pressed }) => [{ opacity: pressed ? 0.86 : disabled ? 0.5 : 1 }, style]}
    >
      {loading ? <ActivityIndicator color={colors.card} /> : icon}
      <Text className={`text-base font-bold ${textClasses[variant]}`}>{title}</Text>
    </Pressable>
  );
}
