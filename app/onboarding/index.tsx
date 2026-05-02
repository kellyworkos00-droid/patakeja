import { useState } from "react";
import type { ElementType } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  LockKeyhole,
  MapPin,
  ShieldCheck,
  Sparkles,
  Star,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";

const slides = ["intro", "trust", "nearby", "booking", "final"] as const;

const trustItems: Array<{ title: string; body: string; icon: ElementType; color: string; bg: string; accent: string }> = [
  { title: "Verified Listings", body: "Every home is inspected before going live", icon: ShieldCheck, color: colors.primary, bg: "#DCFCE7", accent: colors.primary },
  { title: "Private & Secure", body: "Chat in-app — your number stays hidden", icon: LockKeyhole, color: "#6366F1", bg: "#EEF2FF", accent: "#6366F1" },
  { title: "Safe Payments", body: "Pay via escrow — funds held until you move in", icon: CheckCircle2, color: "#F59E0B", bg: "#FEF3C7", accent: "#F59E0B" },
];

const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
type CalRow = [string, string, string, string, string, string, string];
const calendarRows: CalRow[] = [
  ["", "", "", "1", "2", "3", "4"],
  ["5", "6", "7", "8", "9", "10", "11"],
  ["12", "13", "14", "15", "16", "17", "18"],
  ["19", "20", "21", "22", "23", "24", "25"],
  ["26", "27", "28", "29", "30", "31", ""],
];
const finalAvatars = [
  { initials: "AK", bg: "#DCFCE7", text: "#16A34A" },
  { initials: "BM", bg: "#EEF2FF", text: "#6366F1" },
  { initials: "JN", bg: "#FEF3C7", text: "#D97706" },
  { initials: "CW", bg: "#FCE7F3", text: "#DB2777" },
];

// ── Slide progress dots ──────────────────────────────────
function SlideDots({ index, light }: { index: number; light?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      {slides.map((_, i) => (
        <View
          key={i}
          style={{
            height: 6,
            width: i === index ? 28 : 6,
            borderRadius: 99,
            backgroundColor:
              i === index
                ? light ? "#fff" : colors.primary
                : light ? "rgba(255,255,255,0.35)" : "#CBD5E1",
          }}
        />
      ))}
    </View>
  );
}

// ── Circular next button ─────────────────────────────────
function NextButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      <ArrowRight color="#fff" size={22} strokeWidth={2.5} />
    </Pressable>
  );
}

// ── Pill skip button ─────────────────────────────────────
function SkipButton({ onPress, light, top }: { onPress: () => void; light?: boolean; top: number }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        position: "absolute",
        top,
        right: 24,
        zIndex: 10,
        backgroundColor: light ? "rgba(255,255,255,0.22)" : "#F1F5F9",
        borderRadius: 99,
        paddingHorizontal: 14,
        paddingVertical: 7,
      }}
    >
      <Text
        style={{
          fontWeight: "700",
          fontSize: 13,
          color: light ? "#fff" : "#64748B",
          letterSpacing: 0.2,
        }}
      >
        Skip
      </Text>
    </Pressable>
  );
}

// ── Reusable white bottom sheet ──────────────────────────
function BottomSheet({ children, bottomInset }: { children: React.ReactNode; bottomInset: number }) {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        paddingHorizontal: 28,
        paddingTop: 10,
        paddingBottom: Math.max(bottomInset + 16, 28),
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 20,
        elevation: 12,
      }}
    >
      {/* Drag handle */}
      <View style={{ width: 40, height: 4, borderRadius: 99, backgroundColor: "#E2E8F0", alignSelf: "center", marginBottom: 22 }} />
      {children}
    </View>
  );
}

export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();

  const slide = slides[index];
  const isLast = index === slides.length - 1;
  const isIntro = slide === slides[0];
  const isTrust = slide === slides[1];
  const isNearby = slide === slides[2];
  const isBooking = slide === slides[3];
  const isFinal = slide === slides[4];

  const skipToLogin = () => router.replace("/auth/login");
  const next = () => {
    if (isLast) { skipToLogin(); return; }
    setIndex((c) => c + 1);
  };

  // Inset-aware positions
  const skipTop = insets.top + 12;
  const brandTop = insets.top + 14;
  const floatingCardTop = insets.top + 60;
  const priceBadgeTop = insets.top + 110;
  const scrollPaddingTop = insets.top + 60;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F1F5F9" }} edges={[]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={{ flex: 1 }}>

        {/* ══════════════════════════════════════════
            SLIDE 1 — Hero Intro
        ══════════════════════════════════════════ */}
        {isIntro ? (
          <View style={{ flex: 1 }}>
            {/* Full bleed image */}
            <Image source={images.onboardingIntro} style={{ position: "absolute", width: "100%", height: "68%", top: 0 }} resizeMode="cover" />

            {/* Top dark scrim for skip readability */}
            <LinearGradient
              colors={["rgba(0,0,0,0.28)", "transparent"]}
              style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100 }}
            />

            {/* Bottom fade from image to white */}
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.7)", "#fff"]}
              style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 180 }}
            />

            <SkipButton onPress={skipToLogin} light top={skipTop} />

            {/* Floating brand badge on image */}
            <View style={{ position: "absolute", top: brandTop, left: 28, flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Image source={images.logo} style={{ width: 32, height: 32, borderRadius: 8 }} resizeMode="contain" />
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#fff", textShadowColor: "rgba(0,0,0,0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }}>
                Pata<Text style={{ color: "#D7F58D" }}>Keja</Text>
              </Text>
            </View>

            <BottomSheet bottomInset={insets.bottom}>
              {/* Pill badge */}
              <View style={{ backgroundColor: "#DCFCE7", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5, alignSelf: "flex-start", flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 14 }}>
                <Sparkles size={12} color={colors.primary} />
                <Text style={{ color: colors.primary, fontWeight: "700", fontSize: 11, letterSpacing: 0.4 }}>Kenya's #1 Rental App</Text>
              </View>

              <Text style={{ fontSize: 32, fontWeight: "800", color: colors.navy, lineHeight: 42, letterSpacing: -0.5 }}>
                Find your next home,{"\n"}the <Text style={{ color: colors.primary }}>smart way.</Text>
              </Text>
              <Text style={{ fontSize: 14, color: "#64748B", marginTop: 10, lineHeight: 23 }}>
                Discover verified homes across Kenya — connect securely and move in with confidence.
              </Text>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 28 }}>
                <SlideDots index={index} />
                <NextButton onPress={next} />
              </View>
            </BottomSheet>
          </View>
        ) : null}

        {/* ══════════════════════════════════════════
            SLIDE 2 — Trust & Safety
        ══════════════════════════════════════════ */}
        {isTrust ? (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <SkipButton onPress={skipToLogin} top={skipTop} />
            <ScrollView contentContainerStyle={{ paddingHorizontal: 28, paddingTop: scrollPaddingTop, paddingBottom: Math.max(insets.bottom + 16, 28) }} showsVerticalScrollIndicator={false}>

              {/* Icon hero */}
              <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <ShieldCheck size={30} color={colors.primary} />
              </View>

              <Text style={{ fontSize: 32, fontWeight: "800", color: colors.navy, lineHeight: 42, letterSpacing: -0.5 }}>
                Built on{"\n"}trust. <Text style={{ color: colors.primary }}>Always.</Text>
              </Text>
              <Text style={{ fontSize: 14, color: "#64748B", marginTop: 10, lineHeight: 23 }}>
                Every listing is checked. Chat securely without sharing your personal contacts.
              </Text>

              <View style={{ marginTop: 26, gap: 12 }}>
                {trustItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <View
                      key={item.title}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 16,
                        backgroundColor: "#F8FAFC",
                        borderRadius: 20,
                        padding: 18,
                        borderLeftWidth: 3,
                        borderLeftColor: item.accent,
                        borderTopWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderTopColor: "#E2E8F0",
                        borderRightColor: "#E2E8F0",
                        borderBottomColor: "#E2E8F0",
                      }}
                    >
                      <View style={{ width: 50, height: 50, borderRadius: 16, backgroundColor: item.bg, alignItems: "center", justifyContent: "center" }}>
                        <Icon color={item.color} size={22} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: "700", color: colors.navy }}>{item.title}</Text>
                        <Text style={{ fontSize: 13, color: "#64748B", marginTop: 3, lineHeight: 19 }}>{item.body}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 32 }}>
                <SlideDots index={index} />
                <NextButton onPress={next} />
              </View>
            </ScrollView>
          </View>
        ) : null}

        {/* ══════════════════════════════════════════
            SLIDE 3 — Nearby Homes
        ══════════════════════════════════════════ */}
        {isNearby ? (
          <View style={{ flex: 1 }}>
            <Image source={images.onboardingHome} style={{ position: "absolute", width: "100%", height: "62%", top: 0 }} resizeMode="cover" />

            {/* Subtle dark top scrim */}
            <LinearGradient
              colors={["rgba(0,0,0,0.32)", "transparent"]}
              style={{ position: "absolute", top: 0, left: 0, right: 0, height: 130 }}
            />
            {/* Bottom fade */}
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.75)", "#fff"]}
              style={{ position: "absolute", top: "48%", left: 0, right: 0, height: 180 }}
            />

            <SkipButton onPress={skipToLogin} light top={skipTop} />

            {/* Floating location card */}
            <View
              style={{
                position: "absolute",
                top: floatingCardTop,
                left: 24,
                backgroundColor: "#fff",
                borderRadius: 22,
                paddingHorizontal: 16,
                paddingVertical: 14,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.14,
                shadowRadius: 18,
                elevation: 10,
                minWidth: 190,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={13} color={colors.primary} />
                </View>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy }}>Kilimani, Nairobi</Text>
              </View>
              <Text style={{ fontSize: 28, fontWeight: "800", color: colors.navy, marginTop: 6 }}>
                2.3 <Text style={{ fontSize: 15, fontWeight: "600", color: "#64748B" }}>km away</Text>
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                <Star size={11} color="#F59E0B" fill="#F59E0B" />
                <Text style={{ fontSize: 12, color: "#64748B" }}>4.9 · 12 homes available</Text>
              </View>
            </View>

            {/* Price badge top right */}
            <View
              style={{
                position: "absolute",
                top: priceBadgeTop,
                right: 24,
                backgroundColor: colors.primary,
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 10,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
                elevation: 7,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 11, fontWeight: "600", opacity: 0.85 }}>From</Text>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800", letterSpacing: -0.3 }}>Ksh 15k</Text>
              <Text style={{ color: "rgba(255,255,255,0.75)", fontSize: 11 }}>per month</Text>
            </View>

            <BottomSheet bottomInset={insets.bottom}>
              <Text style={{ fontSize: 30, fontWeight: "800", color: colors.navy, lineHeight: 40, letterSpacing: -0.5 }}>
                Homes near you,{"\n"}at the <Text style={{ color: colors.primary }}>right price.</Text>
              </Text>
              <Text style={{ fontSize: 14, color: "#64748B", marginTop: 10, lineHeight: 23 }}>
                Explore homes in the best neighbourhoods that fit your budget and lifestyle.
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 24 }}>
                <SlideDots index={index} />
                <NextButton onPress={next} />
              </View>
            </BottomSheet>
          </View>
        ) : null}

        {/* ══════════════════════════════════════════
            SLIDE 4 — Book Viewings
        ══════════════════════════════════════════ */}
        {isBooking ? (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <SkipButton onPress={skipToLogin} top={skipTop} />
            <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingTop: scrollPaddingTop, paddingBottom: Math.max(insets.bottom + 16, 28) }} showsVerticalScrollIndicator={false}>

              {/* Icon hero */}
              <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <CalendarDays color={colors.primary} size={28} />
              </View>

              <Text style={{ fontSize: 32, fontWeight: "800", color: colors.navy, lineHeight: 42, letterSpacing: -0.5 }}>
                Book viewings{"\n"}in <Text style={{ color: colors.primary }}>seconds.</Text>
              </Text>
              <Text style={{ fontSize: 14, color: "#64748B", marginTop: 10, lineHeight: 23 }}>
                Schedule viewings in a few taps and connect with landlords on your terms.
              </Text>

              {/* Calendar card */}
              <View style={{ marginTop: 22, borderRadius: 22, backgroundColor: "#F8FAFC", padding: 18, borderWidth: 1, borderColor: "#E2E8F0" }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <Text style={{ color: "#CBD5E1", fontSize: 18, fontWeight: "700" }}>‹</Text>
                  <Text style={{ fontSize: 14, fontWeight: "800", color: colors.navy, letterSpacing: 0.2 }}>May 2026</Text>
                  <Text style={{ color: "#CBD5E1", fontSize: 18, fontWeight: "700" }}>›</Text>
                </View>
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
                  {weekDays.map((d) => (
                    <Text key={d} style={{ width: 34, textAlign: "center", fontSize: 11, fontWeight: "700", color: "#94A3B8", letterSpacing: 0.3 }}>{d}</Text>
                  ))}
                </View>
                {calendarRows.map((row, ri) => (
                  <View key={ri} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                    {row.map((cell, ci) => {
                      const dayNum = Number(cell) || 0;
                      const isSelected = dayNum === 14;
                      const isToday = dayNum === 2;
                      return (
                        <View
                          key={ci}
                          style={{
                            width: 34,
                            height: 34,
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 17,
                            backgroundColor: isSelected ? colors.primary : isToday ? "#DCFCE7" : "transparent",
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 13,
                              fontWeight: isSelected || isToday ? "800" : "500",
                              color: isSelected ? "#fff" : isToday ? colors.primary : dayNum === 0 ? "transparent" : "#334155",
                            }}
                          >
                            {dayNum > 0 ? cell : " "}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>

              {/* Booking preview card */}
              <View
                style={{
                  marginTop: 14,
                  flexDirection: "row",
                  gap: 14,
                  alignItems: "center",
                  borderRadius: 18,
                  backgroundColor: "#F8FAFC",
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                  padding: 14,
                }}
              >
                <Image source={images.onboardingHome} style={{ width: 64, height: 64, borderRadius: 14 }} resizeMode="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: colors.navy }}>2 Bedroom Apartment</Text>
                  <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Kilimani, Nairobi</Text>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary, marginTop: 5 }}>Wed, 14 May · 11:00 AM</Text>
                </View>
                <View style={{ backgroundColor: "#DCFCE7", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 }}>
                  <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "800" }}>Booked</Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 28 }}>
                <SlideDots index={index} />
                <NextButton onPress={next} />
              </View>
            </ScrollView>
          </View>
        ) : null}

        {/* ══════════════════════════════════════════
            SLIDE 5 — Final CTA
        ══════════════════════════════════════════ */}
        {isFinal ? (
          <View style={{ flex: 1 }}>
            {/* Full image */}
            <Image source={images.onboardingPerson} style={{ position: "absolute", width: "100%", height: "58%", top: 0 }} resizeMode="cover" />

            {/* Green tinted overlay */}
            <LinearGradient
              colors={["rgba(15,23,42,0.18)", "rgba(22,163,74,0.45)"]}
              style={{ position: "absolute", top: 0, left: 0, right: 0, height: "58%" }}
            />

            {/* Fade to white */}
            <LinearGradient
              colors={["transparent", "rgba(255,255,255,0.8)", "#fff"]}
              style={{ position: "absolute", top: "44%", left: 0, right: 0, height: 180 }}
            />

            {/* Text on image */}
            <View style={{ position: "absolute", top: brandTop, left: 28, right: 28 }}>
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.18)",
                  borderRadius: 99,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  alignSelf: "flex-start",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 16,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.3)",
                }}
              >
                <Text style={{ fontSize: 13 }}>🏠</Text>
                <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12, letterSpacing: 0.3 }}>Kenya's Trusted Rental App</Text>
              </View>
              <Text style={{ fontSize: 36, fontWeight: "800", color: "#fff", lineHeight: 46, letterSpacing: -0.8 }}>
                Your new home{"\n"}journey <Text style={{ color: "#D7F58D" }}>starts{"\n"}here.</Text>
              </Text>
            </View>

            {/* Bottom panel */}
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "#fff",
                borderTopLeftRadius: 36,
                borderTopRightRadius: 36,
                paddingHorizontal: 24,
                paddingTop: 10,
                paddingBottom: Math.max(insets.bottom + 16, 28),
              }}
            >
              {/* Handle */}
              <View style={{ width: 40, height: 4, borderRadius: 99, backgroundColor: "#E2E8F0", alignSelf: "center", marginBottom: 20 }} />

              {/* Social proof row */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F8FAFC",
                  borderRadius: 18,
                  padding: 14,
                  marginBottom: 18,
                  gap: 12,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {finalAvatars.map((av, i) => (
                    <View
                      key={av.initials}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: av.bg,
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: i === 0 ? 0 : -10,
                        borderWidth: 2,
                        borderColor: "#fff",
                      }}
                    >
                      <Text style={{ fontSize: 10, fontWeight: "800", color: av.text }}>{av.initials}</Text>
                    </View>
                  ))}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: "800", color: colors.navy }}>10,000+ homes found</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 3 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={10} color="#F59E0B" fill="#F59E0B" />
                    ))}
                    <Text style={{ fontSize: 11, color: "#64748B", marginLeft: 4 }}>4.9 · App Store</Text>
                  </View>
                </View>
              </View>

              {/* Get Started button */}
              <Pressable
                onPress={skipToLogin}
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 18,
                  paddingVertical: 17,
                  alignItems: "center",
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.35,
                  shadowRadius: 14,
                  elevation: 8,
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.3 }}>Get Started</Text>
              </Pressable>

              {/* Log in link */}
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 18, gap: 4 }}>
                <Text style={{ fontSize: 14, color: "#94A3B8" }}>Already have an account?</Text>
                <Pressable onPress={skipToLogin}>
                  <Text style={{ fontSize: 14, fontWeight: "800", color: colors.primary }}> Log in</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ) : null}

      </View>
    </SafeAreaView>
  );
}
