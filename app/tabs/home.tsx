import type { ElementType } from "react";
import { useEffect, useRef, useState } from "react";
import {
  Animated, Image, Pressable, ScrollView, StatusBar,
  Text, View, Dimensions,
} from "react-native";
import { router } from "expo-router";
import {
  Bell, ChevronRight, Heart, LockKeyhole, MapPin,
  MessageCircle, ShieldCheck, SlidersHorizontal, Star, Zap,
} from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { listings, Listing } from "@/data/mockListings";

const { width: SW } = Dimensions.get("window");

// ─── data ──────────────────────────────────────────────────────────────────
const filters: { label: string; icon: ElementType }[] = [
  { label: "All",        icon: () => <Text style={{ fontSize: 15 }}>🏠</Text> },
  { label: "Bedsitters", icon: () => <Text style={{ fontSize: 15 }}>🛏️</Text> },
  { label: "1 Bedroom",  icon: () => <Text style={{ fontSize: 15 }}>🛏️</Text> },
  { label: "2 Bedroom",  icon: () => <Text style={{ fontSize: 15 }}>🛏️</Text> },
  { label: "3+ Bedroom", icon: () => <Text style={{ fontSize: 15 }}>🏡</Text> },
];

const heroSlides = [
  {
    image: images.onboardingIntro,
    tag: "Welcome Home",
    title: "Find your next\nhome, the smart way.",
    sub: "Discover verified homes across Kenya with confidence.",
    chip: "Kenya's #1 Rental App",
  },
  {
    image: images.onboardingTrust,
    tag: "Trust First",
    title: "Built on trust.\nAlways.",
    sub: "Every listing is checked, every chat is private.",
    chip: "Verified and Secure",
  },
  {
    image: images.onboardingHome,
    tag: "Nearby Homes",
    title: "Premium homes\nnear your vibe.",
    sub: "Fresh listings added daily near where you want to be.",
    chip: "Updated Daily",
  },
  {
    image: images.onboardingPerson,
    tag: "Safe Payments",
    title: "Pay securely\nwith escrow.",
    sub: "Your money stays protected until move-in is confirmed.",
    chip: "Escrow Protected",
  },
];

const featuredHomes = [
  { ...listings[0], rating: "4.8", tag: "FEATURED" },
  { ...listings[1], rating: "4.6", tag: "FEATURED" },
  { ...listings[2], rating: "4.9", tag: "HOT DEAL" },
];

const recommendedHomes = listings;

const stats = [
  { value: "500+", label: "Verified Homes" },
  { value: "4.9★", label: "App Rating" },
  { value: "2k+", label: "Happy Renters" },
];

// ─── shadow preset ──────────────────────────────────────────────────────────
const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 5,
};
const shadowStrong = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.14,
  shadowRadius: 20,
  elevation: 10,
};

// ─── sub-components ─────────────────────────────────────────────────────────
function FilterChip({
  label, icon: Icon, active, onPress,
}: { label: string; icon: ElementType; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        {
          flexDirection: "row", alignItems: "center", gap: 6,
          height: 42, borderRadius: 21, paddingHorizontal: 16,
          backgroundColor: active ? colors.navy : "#fff",
        },
        active ? {} : shadow,
      ]}
    >
      <Icon />
      <Text style={{ fontSize: 14, fontWeight: "700", color: active ? "#fff" : colors.navy }}>
        {label}
      </Text>
    </Pressable>
  );
}

function TrustPill({ type }: { type: "Verified" | "Secure Chat" | "Escrow" }) {
  const cfg = {
    Verified:     { icon: ShieldCheck, bg: "#DCFCE7", color: colors.primary },
    "Secure Chat":{ icon: LockKeyhole, bg: "#FEF3C7", color: "#D97706" },
    Escrow:       { icon: ShieldCheck, bg: "#EDE9FE", color: "#7C3AED" },
  }[type];
  const Icon = cfg.icon;
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: cfg.bg, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 }}>
      <Icon size={11} color={cfg.color} strokeWidth={2.8} />
      <Text style={{ fontSize: 11, fontWeight: "700", color: cfg.color }}>{type}</Text>
    </View>
  );
}

function FeaturedCard({ listing }: { listing: Listing & { rating?: string; tag?: string } }) {
  const [saved, setSaved] = useState(listing.saved ?? false);
  const tagColor = listing.tag === "HOT DEAL" ? "#EF4444" : colors.primary;
  return (
    <Pressable
      onPress={() => router.push(`/listing/${listing.id}`)}
      style={[{ width: 260, borderRadius: 24, backgroundColor: "#fff", overflow: "hidden", marginRight: 4 }, shadowStrong]}
    >
      <View style={{ height: 170, position: "relative" }}>
        <Image source={listing.image} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(15,23,42,0.55)"]}
          style={{ position: "absolute", inset: 0 } as any}
        />
        {/* Tag badge */}
        <View style={{ position: "absolute", top: 12, left: 12, backgroundColor: tagColor, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 }}>
          <Text style={{ fontSize: 10, fontWeight: "800", color: "#fff", letterSpacing: 0.8 }}>{listing.tag}</Text>
        </View>
        {/* Heart */}
        <Pressable
          onPress={() => setSaved((s) => !s)}
          style={{ position: "absolute", top: 10, right: 10, width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.92)", alignItems: "center", justifyContent: "center" }}
        >
          <Heart size={18} color={saved ? "#EF4444" : "#94A3B8"} fill={saved ? "#EF4444" : "transparent"} strokeWidth={2.2} />
        </Pressable>
        {/* Rating */}
        {listing.rating && (
          <View style={{ position: "absolute", bottom: 10, left: 12, flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3 }}>
            <Star size={12} color="#FCD34D" fill="#FCD34D" />
            <Text style={{ fontSize: 12, fontWeight: "800", color: "#fff" }}>{listing.rating}</Text>
          </View>
        )}
        {/* Photos count */}
        <View style={{ position: "absolute", bottom: 10, right: 12, flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 10, paddingHorizontal: 7, paddingVertical: 3 }}>
          <Text style={{ fontSize: 11, color: "#fff", fontWeight: "600" }}>📷 {listing.photos}</Text>
        </View>
      </View>
      <View style={{ padding: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: colors.navy }}>{listing.price}</Text>
            <Text style={{ fontSize: 11, color: "#94A3B8", fontWeight: "600", marginTop: -2 }}>/month</Text>
          </View>
        </View>
        <Text style={{ fontSize: 15, fontWeight: "700", color: colors.navy, marginTop: 4 }} numberOfLines={1}>{listing.title}</Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 }}>
          <MapPin size={13} color="#94A3B8" />
          <Text style={{ fontSize: 13, color: "#64748B", fontWeight: "500", flex: 1 }} numberOfLines={1}>{listing.location}</Text>
          <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: "#CBD5E1" }} />
          <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "700" }}>{listing.distance}</Text>
        </View>
        <View style={{ flexDirection: "row", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          <TrustPill type="Verified" />
          <TrustPill type="Secure Chat" />
          <TrustPill type="Escrow" />
        </View>
      </View>
    </Pressable>
  );
}

function RecommendedCard({ listing }: { listing: Listing }) {
  const [saved, setSaved] = useState(listing.saved ?? false);
  return (
    <Pressable
      onPress={() => router.push(`/listing/${listing.id}`)}
      style={[{ flexDirection: "row", gap: 12, borderRadius: 22, backgroundColor: "#fff", padding: 12, marginBottom: 14 }, shadow]}
    >
      <View style={{ width: 110, height: 110, borderRadius: 16, overflow: "hidden", position: "relative" }}>
        <Image source={listing.image} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        <Pressable
          onPress={() => setSaved((s) => !s)}
          style={{ position: "absolute", top: 6, right: 6, width: 28, height: 28, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.9)", alignItems: "center", justifyContent: "center" }}
        >
          <Heart size={14} color={saved ? "#EF4444" : "#94A3B8"} fill={saved ? "#EF4444" : "transparent"} strokeWidth={2.2} />
        </Pressable>
        <View style={{ position: "absolute", bottom: 6, left: 6, flexDirection: "row", alignItems: "center", gap: 3, backgroundColor: "rgba(0,0,0,0.45)", borderRadius: 8, paddingHorizontal: 5, paddingVertical: 2 }}>
          <Text style={{ fontSize: 10, color: "#fff", fontWeight: "600" }}>📷 {listing.photos}</Text>
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "800", color: colors.navy }}>{listing.price}</Text>
          <Text style={{ fontSize: 11, color: "#94A3B8", fontWeight: "600", marginTop: -2 }}>/month</Text>
          <Text style={{ fontSize: 14, fontWeight: "700", color: colors.navy, marginTop: 2 }} numberOfLines={1}>{listing.title}</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
            <MapPin size={12} color="#94A3B8" />
            <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "500" }} numberOfLines={1}>{listing.location}</Text>
            <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "700" }}>· {listing.distance}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 5, marginTop: 6 }}>
            <TrustPill type="Verified" />
            <TrustPill type="Secure Chat" />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 8, marginTop: 10 }}>
          <Pressable
            onPress={() => router.push(`/bookings/create`)}
            style={{
              flex: 1, borderRadius: 12, paddingVertical: 9, alignItems: "center",
              backgroundColor: colors.primary,
              shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: "800", color: "#fff" }}>Book Viewing</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push(`/chat/${listing.id}`)}
            style={{ width: 38, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#F1F5F9" }}
          >
            <MessageCircle size={18} color={colors.navy} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

// ─── main screen ────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState(0);
  const [heroIndex, setHeroIndex] = useState(0);
  const heroRef = useRef<ScrollView>(null);

  // auto-scroll hero every 4.5 s
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => {
        const next = (prev + 1) % heroSlides.length;
        heroRef.current?.scrollTo({ x: next * (SW - 40), animated: true });
        return next;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ── Header ── */}
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, gap: 12 }}>
          <Pressable
            style={[{ width: 46, height: 46, borderRadius: 23, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center" }, shadow]}
          >
            <Text style={{ fontSize: 18 }}>👤</Text>
          </Pressable>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: "#94A3B8", fontWeight: "600" }}>Good morning 👋</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 1 }}>
              <MapPin size={13} color={colors.primary} />
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.navy }}>Nairobi, Kenya</Text>
            </View>
          </View>

          <Pressable
            onPress={() => router.push("/notifications")}
            style={[{ width: 46, height: 46, borderRadius: 23, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }, shadow]}
          >
            <Bell size={20} color={colors.navy} />
            <View style={{ position: "absolute", top: 10, right: 10, width: 9, height: 9, borderRadius: 5, backgroundColor: colors.primary, borderWidth: 1.5, borderColor: "#F8FAFC" }} />
          </Pressable>
        </View>

        {/* ── Search bar ── */}
        <Pressable
          onPress={() => router.push("/search")}
          style={[{
            flexDirection: "row", alignItems: "center", gap: 10,
            backgroundColor: "#fff", borderRadius: 20,
            paddingHorizontal: 16, paddingVertical: 14,
            marginHorizontal: 20, marginBottom: 16,
          }, shadow]}
        >
          <MapPin size={18} color={colors.primary} />
          <Text style={{ flex: 1, fontSize: 15, color: "#94A3B8", fontWeight: "500" }}>Where do you want to live?</Text>
          <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center" }}>
            <SlidersHorizontal size={16} color="#fff" />
          </View>
        </Pressable>

        {/* ── Stats row ── */}
        <View style={{ flexDirection: "row", marginHorizontal: 20, marginBottom: 18, borderRadius: 20, backgroundColor: "#fff", padding: 16, ...shadow }}>
          {stats.map((s, i) => (
            <View key={s.label} style={{ flex: 1, alignItems: "center", borderRightWidth: i < stats.length - 1 ? 1 : 0, borderRightColor: "#E2E8F0" }}>
              <Text style={{ fontSize: 18, fontWeight: "800", color: colors.navy }}>{s.value}</Text>
              <Text style={{ fontSize: 11, color: "#94A3B8", fontWeight: "600", marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Filter chips ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingBottom: 2, marginBottom: 20 }}>
          {filters.map((f, i) => (
            <FilterChip key={f.label} label={f.label} icon={f.icon} active={i === activeFilter} onPress={() => setActiveFilter(i)} />
          ))}
        </ScrollView>

        {/* ── Hero carousel ── */}
        <View style={{ marginHorizontal: 20, marginBottom: 24, borderRadius: 30, overflow: "hidden" }}>
          <ScrollView
            ref={heroRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / (SW - 40));
              setHeroIndex(idx);
            }}
            style={{ borderRadius: 30 }}
          >
            {heroSlides.map((slide, i) => (
              <View key={i} style={{ width: SW - 40, height: 254, borderRadius: 30, overflow: "hidden" }}>
                <Image source={slide.image} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
                <LinearGradient
                  colors={["rgba(0,0,0,0.18)", "rgba(2,6,23,0.76)"]}
                  style={{ position: "absolute", inset: 0 } as any}
                />

                <View style={{ position: "absolute", top: 14, left: 14, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 18, paddingHorizontal: 10, paddingVertical: 7 }}>
                  <Image source={images.logo} style={{ width: 18, height: 18, borderRadius: 5 }} resizeMode="contain" />
                  <Text style={{ fontSize: 12, fontWeight: "800", color: "#fff" }}>PataKeja</Text>
                </View>

                <View style={{ position: "absolute", top: 14, right: 14, backgroundColor: "rgba(22,163,74,0.2)", borderRadius: 18, paddingHorizontal: 10, paddingVertical: 7 }}>
                  <Text style={{ fontSize: 11, fontWeight: "800", color: "#DCFCE7", letterSpacing: 0.5 }}>{slide.chip}</Text>
                </View>

                <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 18 }}>
                  <Text style={{ fontSize: 11, fontWeight: "800", color: "#A7F3D0", letterSpacing: 1.1 }}>{slide.tag.toUpperCase()}</Text>
                  <Text style={{ fontSize: 25, fontWeight: "800", color: "#fff", lineHeight: 31, marginTop: 3 }}>{slide.title}</Text>
                  <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.86)", marginTop: 6 }}>{slide.sub}</Text>

                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 10 }}>
                    <View style={{ backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 99, paddingHorizontal: 9, paddingVertical: 5 }}>
                      <Text style={{ fontSize: 11, fontWeight: "700", color: "#fff" }}>Verified</Text>
                    </View>
                    <View style={{ backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 99, paddingHorizontal: 9, paddingVertical: 5 }}>
                      <Text style={{ fontSize: 11, fontWeight: "700", color: "#fff" }}>Secure Chat</Text>
                    </View>
                    <View style={{ backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 99, paddingHorizontal: 9, paddingVertical: 5 }}>
                      <Text style={{ fontSize: 11, fontWeight: "700", color: "#fff" }}>Escrow</Text>
                    </View>
                  </View>

                  <Pressable
                    onPress={() => router.push("/search")}
                    style={{ marginTop: 12, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 20, alignSelf: "flex-start",
                      shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 }}
                  >
                    <Text style={{ fontSize: 14, fontWeight: "800", color: "#fff" }}>Explore Homes →</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
          {/* Dot indicators */}
          <View style={{ flexDirection: "row", gap: 6, position: "absolute", bottom: 14, right: 14 }}>
            {heroSlides.map((_, i) => (
              <View key={i} style={{ width: heroIndex === i ? 20 : 7, height: 7, borderRadius: 4, backgroundColor: heroIndex === i ? "#fff" : "rgba(255,255,255,0.4)" }} />
            ))}
          </View>
        </View>

        {/* ── Featured Homes ── */}
        <View style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Zap size={18} color="#F59E0B" fill="#F59E0B" />
              <Text style={{ fontSize: 18, fontWeight: "800", color: colors.navy }}>Featured Homes</Text>
            </View>
            <Pressable onPress={() => router.push("/search")} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary }}>See all</Text>
              <ChevronRight size={15} color={colors.primary} />
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
            {featuredHomes.map((l) => <FeaturedCard key={l.id} listing={l} />)}
          </ScrollView>
        </View>

        {/* ── Recommended ── */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: colors.navy }}>Recommended For You</Text>
            <Pressable onPress={() => router.push("/search")} style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary }}>See all</Text>
              <ChevronRight size={15} color={colors.primary} />
            </Pressable>
          </View>
          {recommendedHomes.map((l) => <RecommendedCard key={l.id} listing={l} />)}
        </View>

        {/* ── Trust footer ── */}
        <View style={{ marginHorizontal: 20, marginTop: 8, borderRadius: 20, backgroundColor: colors.navy, padding: 20, flexDirection: "row", justifyContent: "space-around" }}>
          {[
            { icon: ShieldCheck, label: "Verified\nHomes" },
            { icon: LockKeyhole, label: "Secure\nChat" },
            { icon: ShieldCheck, label: "Safe\nPayments" },
          ].map(({ icon: Icon, label }) => (
            <View key={label} style={{ alignItems: "center", gap: 6 }}>
              <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: "rgba(22,163,74,0.2)", alignItems: "center", justifyContent: "center" }}>
                <Icon size={20} color={colors.primary} strokeWidth={2.2} />
              </View>
              <Text style={{ fontSize: 12, fontWeight: "700", color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 17 }}>{label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ── View Map FAB ── */}
      <Pressable
        onPress={() => router.push("/search")}
        style={[{
          position: "absolute", bottom: 96, right: 20,
          flexDirection: "row", alignItems: "center", gap: 8,
          backgroundColor: colors.navy, borderRadius: 20,
          paddingHorizontal: 18, paddingVertical: 13,
        }, shadowStrong]}
      >
        <Text style={{ fontSize: 16 }}>🗺️</Text>
        <Text style={{ fontSize: 14, fontWeight: "800", color: "#fff" }}>View Map</Text>
      </Pressable>
    </SafeAreaView>
  );
}
