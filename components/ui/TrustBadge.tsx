import { Text, View } from "react-native";
import { BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react-native";
import { colors } from "@/constants/colors";

type TrustBadgeProps = {
  label: "Verified" | "Verified Listing" | "Secure Chat" | "Escrow" | "Escrow Available";
  compact?: boolean;
};

export function TrustBadge({ label, compact }: TrustBadgeProps) {
  const Icon = label.includes("Chat") ? LockKeyhole : label.includes("Escrow") ? ShieldCheck : BadgeCheck;

  return (
    <View className={`flex-row items-center gap-1.5 rounded-full bg-primary/10 ${compact ? "px-2.5 py-1" : "px-3 py-2"}`}>
      <Icon color={colors.primary} size={compact ? 13 : 16} strokeWidth={2.6} />
      <Text className={`${compact ? "text-xs" : "text-sm"} font-bold text-navy/75`}>{label}</Text>
    </View>
  );
}
