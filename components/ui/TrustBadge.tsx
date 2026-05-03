import { Text, View } from "react-native";
import { BadgeCheck, LockKeyhole, ShieldCheck } from "lucide-react-native";

type TrustBadgeLabel = "Verified" | "Verified Listing" | "Secure Chat" | "Escrow" | "Escrow Available";

type TrustBadgeProps = {
  label: TrustBadgeLabel;
  compact?: boolean;
};

const BADGE_CONFIG: Record<TrustBadgeLabel, { Icon: typeof BadgeCheck; color: string; bg: string }> = {
  "Verified":         { Icon: BadgeCheck,  color: "#16A34A", bg: "#F0FDF4" },
  "Verified Listing": { Icon: BadgeCheck,  color: "#16A34A", bg: "#F0FDF4" },
  "Secure Chat":      { Icon: LockKeyhole, color: "#D97706", bg: "#FFFBEB" },
  "Escrow":           { Icon: ShieldCheck, color: "#D97706", bg: "#FFFBEB" },
  "Escrow Available": { Icon: ShieldCheck, color: "#D97706", bg: "#FFFBEB" },
};

export function TrustBadge({ label, compact }: TrustBadgeProps) {
  const { Icon, color, bg } = BADGE_CONFIG[label];

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        borderRadius: 20,
        backgroundColor: bg,
        paddingHorizontal: compact ? 8 : 12,
        paddingVertical: compact ? 4 : 8,
      }}
    >
      <Icon color={color} size={compact ? 12 : 15} strokeWidth={2.6} />
      <Text style={{ fontSize: compact ? 11 : 13, fontWeight: "700", color: "#0F172A", opacity: 0.75 }}>{label}</Text>
    </View>
  );
}
