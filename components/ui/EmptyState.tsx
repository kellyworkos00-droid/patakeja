import { ReactNode } from "react";
import { Text, View } from "react-native";
import { Home } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";

type EmptyStateProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({ title, message, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <View className="items-center rounded-3xl bg-white p-8">
      <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        {icon ?? <Home color={colors.primary} size={30} />}
      </View>
      <Text className="text-center text-xl font-extrabold text-navy">{title}</Text>
      <Text className="mt-2 text-center text-base leading-6 text-navy/60">{message}</Text>
      {actionLabel && onAction ? (
        <AppButton title={actionLabel} onPress={onAction} full style={{ marginTop: 20 }} />
      ) : null}
    </View>
  );
}
