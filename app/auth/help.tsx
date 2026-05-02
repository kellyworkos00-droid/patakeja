import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { router } from "expo-router";
import {
  ArrowLeft,
  ChevronDown,
  CircleHelp,
  Headset,
  LockKeyhole,
  Mail,
  MessageCircle,
  ShieldCheck,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const faqs: FaqItem[] = [
  {
    id: "1",
    question: "I forgot my password. What should I do?",
    answer:
      "Use the Forgot Password link on login, enter your email, and follow the 6-digit reset code flow.",
  },
  {
    id: "2",
    question: "Why am I seeing 'Couldn't find your account'?",
    answer:
      "The email may be different from the one used to register. Try another email, or create a new account from Sign Up.",
  },
  {
    id: "3",
    question: "My verification code did not arrive.",
    answer:
      "Wait a minute, check your spam folder, and tap Resend Code. Make sure the email is typed correctly.",
  },
  {
    id: "4",
    question: "How do I keep my account secure?",
    answer:
      "Use a strong password, never share verification codes, and only use in-app chat and payment features.",
  },
];

const cardShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,
};

export default function AuthHelpScreen() {
  const insets = useSafeAreaInsets();
  const [openId, setOpenId] = useState<string>("1");

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? "" : id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingTop: 6,
          paddingBottom: 10,
        }}
      >
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/auth/login"))}
          style={[
            {
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "#E2E8F0",
              alignItems: "center",
              justifyContent: "center",
            },
            cardShadow,
          ]}
        >
          <ArrowLeft size={20} color={colors.navy} strokeWidth={2.5} />
        </Pressable>

        <Text style={{ fontSize: 18, fontWeight: "800", color: colors.navy }}>Help Center</Text>

        <View style={{ width: 44, height: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom + 24, 32),
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[{ borderRadius: 28, overflow: "hidden", marginBottom: 22 }, cardShadow]}>
          <Image source={images.authHero} style={{ width: "100%", height: 170 }} resizeMode="cover" />
          <LinearGradient
            colors={["transparent", "rgba(15,23,42,0.65)"]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
          <View style={{ position: "absolute", left: 18, right: 18, bottom: 14 }}>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "800",
                letterSpacing: 2,
                color: "rgba(255,255,255,0.75)",
                marginBottom: 6,
              }}
            >
              PATAKEJA SUPPORT
            </Text>
            <Text style={{ fontSize: 17, fontWeight: "800", color: "#fff", lineHeight: 23 }}>
              Get quick help with login, password reset, and account safety
            </Text>
          </View>
        </View>

        <View
          style={[
            {
              backgroundColor: "#F0FDF4",
              borderWidth: 1.5,
              borderColor: "#BBF7D0",
              borderRadius: 20,
              padding: 16,
              marginBottom: 18,
              flexDirection: "row",
              gap: 12,
              alignItems: "center",
            },
            { shadowColor: colors.primary, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 4 },
          ]}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: "#DCFCE7",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShieldCheck size={20} color={colors.primary} strokeWidth={2.5} />
          </View>
          <Text style={{ flex: 1, fontSize: 13, lineHeight: 20, color: "#166534", fontWeight: "600" }}>
            Never share your verification codes. Patakeja support will never ask for your password.
          </Text>
        </View>

        <Text style={{ fontSize: 13, fontWeight: "800", letterSpacing: 1.1, color: "#94A3B8", marginBottom: 10 }}>
          FREQUENTLY ASKED QUESTIONS
        </Text>

        <View style={[{ backgroundColor: "#fff", borderRadius: 24, padding: 8, marginBottom: 18 }, cardShadow]}>
          {faqs.map((item, index) => {
            const isOpen = openId === item.id;
            return (
              <View key={item.id}>
                <Pressable
                  onPress={() => toggleFaq(item.id)}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.82 : 1,
                    paddingHorizontal: 12,
                    paddingVertical: 14,
                    borderRadius: 16,
                    backgroundColor: isOpen ? "#F8FAFC" : "transparent",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  })}
                >
                  <CircleHelp size={18} color={isOpen ? colors.primary : "#94A3B8"} strokeWidth={2.3} />
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: "700", color: colors.navy }}>{item.question}</Text>
                  <ChevronDown
                    size={18}
                    color={isOpen ? colors.primary : "#94A3B8"}
                    style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
                  />
                </Pressable>
                {isOpen && (
                  <View
                    style={{
                      marginTop: 2,
                      marginBottom: 10,
                      marginHorizontal: 40,
                      backgroundColor: "#F8FAFC",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#E2E8F0",
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                    }}
                  >
                    <Text style={{ fontSize: 13, lineHeight: 21, color: "#475569", fontWeight: "500" }}>{item.answer}</Text>
                  </View>
                )}
                {index < faqs.length - 1 && <View style={{ height: 1, backgroundColor: "#F1F5F9", marginHorizontal: 8 }} />}
              </View>
            );
          })}
        </View>

        <Text style={{ fontSize: 13, fontWeight: "800", letterSpacing: 1.1, color: "#94A3B8", marginBottom: 10 }}>
          CONTACT SUPPORT
        </Text>

        <View style={{ gap: 10, marginBottom: 18 }}>
          <Pressable
            onPress={() => Alert.alert("Support", "In-app chat support will be available soon.")}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <View
              style={[
                {
                  backgroundColor: "#fff",
                  borderRadius: 18,
                  borderWidth: 1.5,
                  borderColor: "#E2E8F0",
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                },
                cardShadow,
              ]}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: "#EFF6FF",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Headset size={18} color="#2563EB" strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "800", color: colors.navy }}>Live Support Chat</Text>
                <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Fastest way to get help from our team</Text>
              </View>
              <MessageCircle size={18} color="#94A3B8" strokeWidth={2.4} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => Alert.alert("Support Email", "Email us at support@patakeja.com")}
            style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
          >
            <View
              style={[
                {
                  backgroundColor: "#fff",
                  borderRadius: 18,
                  borderWidth: 1.5,
                  borderColor: "#E2E8F0",
                  paddingHorizontal: 14,
                  paddingVertical: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                },
                cardShadow,
              ]}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: "#F0FDF4",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Mail size={18} color={colors.primary} strokeWidth={2.4} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: "800", color: colors.navy }}>Email Support</Text>
                <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>support@patakeja.com</Text>
              </View>
              <LockKeyhole size={18} color="#94A3B8" strokeWidth={2.4} />
            </View>
          </Pressable>
        </View>

        <Pressable onPress={() => router.replace("/auth/login")} style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
          <View
            style={[
              {
                backgroundColor: colors.primary,
                borderRadius: 18,
                paddingVertical: 16,
                alignItems: "center",
              },
              { shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.26, shadowRadius: 15, elevation: 9 },
            ]}
          >
            <Text style={{ color: "#fff", fontSize: 15, fontWeight: "800" }}>Back to Login</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
