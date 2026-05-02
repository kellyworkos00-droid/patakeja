import { Image, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Bell, ChevronRight, CreditCard, FileText, Globe2, LockKeyhole, LogOut, MapPin, Moon, ShieldCheck, UserRound } from "lucide-react-native";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

const groups = [
  {
    title: "Account",
    items: [
      ["Personal Information", "Update your name and email", UserRound, "/settings/edit-profile"],
      ["Security", "Password and login activity", LockKeyhole, "/settings/edit-profile"],
      ["Verification", "Verify your identity and documents", CreditCard, "/settings/verification"],
      ["Notifications", "Manage notification preferences", Bell, "/notifications"],
    ],
  },
  {
    title: "Preferences",
    items: [
      ["Language", "English", Globe2, ""],
      ["Currency", "KES (Kenyan Shilling)", CreditCard, ""],
      ["Location", "Manage your location preferences", MapPin, "/search"],
      ["Dark Mode", "Light theme active", Moon, ""],
    ],
  },
  {
    title: "Support & Legal",
    items: [
      ["Safety & Security", "Safety tips and reporting", ShieldCheck, "/safety/report"],
      ["Terms & Conditions", "Read platform terms", FileText, ""],
      ["Privacy Policy", "Learn how we protect your data", ShieldCheck, ""],
    ],
  },
];

export default function SettingsScreen() {
  return (
    <ScreenContainer contentClassName="pt-2">
      <FloatingHeader title="Settings" subtitle="Manage your account and preferences" />
      <View className="mb-6 overflow-hidden rounded-[32px] bg-white">
        <Image source={images.settingsDirection} className="h-36 w-full" resizeMode="cover" />
        <View className="absolute inset-x-0 bottom-0 bg-navy/60 px-5 py-4">
          <Text className="text-base font-extrabold text-white">Personalize your account, safety, and notifications</Text>
        </View>
      </View>
      <Pressable onPress={() => router.push("/settings/edit-profile")} className="mb-6 flex-row items-center gap-4 rounded-[32px] bg-white p-5">
        <View className="h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <UserRound color={colors.primary} size={38} />
        </View>
        <View className="flex-1">
          <Text className="text-xl font-extrabold text-navy">Brian Kariuki</Text>
          <Text className="mt-1 text-navy/60">brian.kariuki@email.com</Text>
          <View className="mt-2 flex-row items-center gap-2">
            <ShieldCheck color={colors.primary} size={16} />
            <Text className="font-bold text-primary">Verified Member</Text>
          </View>
        </View>
        <ChevronRight color={colors.navy} size={22} />
      </Pressable>

      {groups.map((group) => (
        <View key={group.title} className="mb-6">
          <Text className="mb-3 text-sm font-extrabold uppercase text-navy/55">{group.title}</Text>
          <View className="overflow-hidden rounded-[28px] bg-white">
            {group.items.map(([title, subtitle, Icon, href]) => (
              <Pressable key={title as string} onPress={() => href && router.push(href as any)} className="flex-row items-center gap-4 border-b border-navy/10 p-4">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon color={colors.primary} size={23} />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-extrabold text-navy">{title as string}</Text>
                  <Text className="mt-1 text-sm text-navy/60">{subtitle as string}</Text>
                </View>
                <ChevronRight color={colors.navy} size={20} />
              </Pressable>
            ))}
          </View>
        </View>
      ))}

      <Pressable className="flex-row items-center gap-4 rounded-[28px] bg-white p-4">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#EF4444]/10">
          <LogOut color="#EF4444" size={23} />
        </View>
        <Text className="flex-1 text-lg font-extrabold text-[#EF4444]">Log Out</Text>
        <ChevronRight color={colors.navy} size={20} />
      </Pressable>
      <Text className="mt-8 text-center text-sm text-navy/45">App Version 1.0.0</Text>
    </ScreenContainer>
  );
}
