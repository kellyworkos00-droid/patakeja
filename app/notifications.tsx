import { Image, Text, View } from "react-native";
import { Bell, CalendarDays, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react-native";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

const notifications = [
  { title: "Viewing reminder", body: "Your Kilimani viewing is tomorrow at 10:00 AM.", icon: CalendarDays },
  { title: "New secure message", body: "John replied inside your protected chat.", icon: MessageCircle },
  { title: "Listing verified", body: "A Westlands apartment matching your search is now verified.", icon: ShieldCheck },
  { title: "Payment protected", body: "Your viewing fee is held in escrow.", icon: CheckCircle2 },
];

export default function NotificationsScreen() {
  return (
    <ScreenContainer contentClassName="pt-2">
      <FloatingHeader title="Notifications" subtitle="Updates about viewings, messages, and trust checks" />
      <View className="mb-5 overflow-hidden rounded-[32px] bg-white">
        <Image source={images.notificationsDirection} className="h-36 w-full" resizeMode="cover" />
        <View className="absolute inset-x-0 bottom-0 bg-navy/60 px-5 py-4">
          <Text className="text-base font-extrabold text-white">Every safety and booking update in one timeline</Text>
        </View>
      </View>
      <View className="rounded-[32px] bg-white p-2">
        {notifications.map((notification) => {
          const Icon = notification.icon;
          return (
            <View key={notification.title} className="flex-row gap-4 rounded-3xl p-4">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Icon color={colors.primary} size={23} />
              </View>
              <View className="flex-1 border-b border-navy/10 pb-4">
                <Text className="text-lg font-extrabold text-navy">{notification.title}</Text>
                <Text className="mt-1 text-base leading-6 text-navy/60">{notification.body}</Text>
              </View>
            </View>
          );
        })}
      </View>
      <View className="mt-5 flex-row items-center gap-3 rounded-3xl bg-primary/10 p-4">
        <Bell color={colors.primary} size={22} />
        <Text className="flex-1 text-sm font-bold leading-5 text-navy">Notifications keep you inside PataKeja for safer rental decisions.</Text>
      </View>
    </ScreenContainer>
  );
}
