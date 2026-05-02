import { Text, View } from "react-native";
import { ShieldAlert } from "lucide-react-native";
import { colors } from "@/constants/colors";

type SafetyNoticeProps = {
  message?: string;
};

export function SafetyNotice({
  message = "Do not share personal contacts or make payments outside PataKeja",
}: SafetyNoticeProps) {
  return (
    <View className="flex-row gap-3 rounded-3xl border border-primary/20 bg-primary/10 p-4">
      <View className="h-10 w-10 items-center justify-center rounded-full bg-white">
        <ShieldAlert color={colors.primary} size={22} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-extrabold text-navy">Stay protected</Text>
        <Text className="mt-1 text-sm leading-5 text-navy/70">{message}</Text>
      </View>
    </View>
  );
}
