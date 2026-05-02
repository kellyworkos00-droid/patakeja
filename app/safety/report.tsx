import { Text, View } from "react-native";
import { AlertTriangle, Flag, MessageCircle, ShieldAlert } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";
import { SafetyNotice } from "@/components/ui/SafetyNotice";

export default function ReportScreen() {
  return (
    <ScreenContainer contentClassName="pt-2">
      <FloatingHeader title="Report" subtitle="Report a listing, user, or unsafe request" />
      <View className="mb-5 rounded-[32px] bg-white p-5">
        <View className="flex-row gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-[#EF4444]/10">
            <ShieldAlert color="#EF4444" size={28} />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-extrabold text-navy">Help keep PataKeja safe</Text>
            <Text className="mt-2 text-base leading-6 text-navy/65">Tell us what happened. Reports are reviewed by the safety team.</Text>
          </View>
        </View>
      </View>

      <View className="gap-4 rounded-[32px] bg-white p-5">
        <AppInput label="Report Type" defaultValue="Listing or user" icon={<Flag color={colors.primary} size={20} />} />
        <AppInput label="Related Chat or Listing" placeholder="Paste listing title or chat name" icon={<MessageCircle color={colors.primary} size={20} />} />
        <AppInput
          label="What happened?"
          placeholder="Describe the issue"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          icon={<AlertTriangle color={colors.primary} size={20} />}
        />
      </View>

      <View className="mt-5">
        <SafetyNotice />
      </View>
      <AppButton title="Submit Report" variant="danger" full style={{ marginTop: 22 }} />
    </ScreenContainer>
  );
}
