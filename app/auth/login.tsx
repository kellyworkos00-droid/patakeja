import { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View, TextInput, Alert } from "react-native";
import { router } from "expo-router";
import { LockKeyhole, Mail, ArrowLeft, Eye, EyeOff, HelpCircle } from "lucide-react-native";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useSignIn, useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";

export const useWarmUpBrowser = () => {
  WebBrowser.maybeCompleteAuthSession();
};

export default function LoginScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startTikTokFlow } = useOAuth({ strategy: "oauth_tiktok" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useWarmUpBrowser();

  const handleSignIn = async () => {
    if (!isLoaded) return;
    if (!email.trim() || !password) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({ identifier: email.trim(), password });
      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
        router.replace("/tabs/home");
      }
    } catch (err: any) {
      Alert.alert("Login failed", err.errors?.[0]?.message || "Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleFlow();
      if (createdSessionId) { setActive?.({ session: createdSessionId }); router.replace("/tabs/home"); }
    } catch { Alert.alert("Error", "Google login failed"); }
  };

  const handleTikTokLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startTikTokFlow();
      if (createdSessionId) { setActive?.({ session: createdSessionId }); router.replace("/tabs/home"); }
    } catch { Alert.alert("Error", "TikTok login failed"); }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ── Nav bar ── */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 20, paddingTop: 6, paddingBottom: 10,
      }}>
        <Pressable
          onPress={() => router.canGoBack() ? router.back() : router.replace("/onboarding")}
          style={{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: "#fff",
            borderWidth: 1, borderColor: "#E2E8F0",
            alignItems: "center", justifyContent: "center",
            shadowColor: "#0F172A", shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
          }}
        >
          <ArrowLeft size={20} color={colors.navy} strokeWidth={2.5} />
        </Pressable>

        <Pressable
          onPress={() => router.push("/settings")}
          style={{
            flexDirection: "row", alignItems: "center", gap: 5,
            backgroundColor: "#fff",
            borderWidth: 1, borderColor: "#E2E8F0",
            borderRadius: 22, paddingHorizontal: 14, paddingVertical: 9,
            shadowColor: "#0F172A", shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
          }}
        >
          <HelpCircle size={15} color={colors.primary} strokeWidth={2.5} />
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary, letterSpacing: 0.2 }}>Help</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom + 24, 32) }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero image */}
        <View style={{ marginBottom: 24, borderRadius: 28, overflow: "hidden" }}>
          <Image source={images.loginDirection} style={{ width: "100%", height: 210 }} resizeMode="cover" />
          <LinearGradient
            colors={["transparent", "rgba(15,23,42,0.45)"]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
          <View style={{ position: "absolute", bottom: 18, left: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: "700", color: "rgba(255,255,255,0.75)", letterSpacing: 1.5 }}>PATAKEJA</Text>
          </View>
        </View>

        {/* Heading */}
        <Text style={{ fontSize: 32, fontWeight: "800", color: colors.navy, letterSpacing: -0.8, lineHeight: 40 }}>
          Welcome{"\n"}back
        </Text>
        <Text style={{ fontSize: 15, color: "#64748B", marginTop: 8, lineHeight: 24 }}>
          Log in to continue finding your perfect home.
        </Text>

        {/* Social buttons */}
        <View style={{ marginTop: 26, gap: 11 }}>
          {/* Google — white elevated */}
          <Pressable
            onPress={handleGoogleLogin}
            disabled={loading}
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", justifyContent: "center",
              backgroundColor: "#fff",
              borderRadius: 18,
              borderWidth: 1.5, borderColor: "#E8EAED",
              paddingVertical: 15, gap: 12,
              opacity: pressed || loading ? 0.7 : 1,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 3 },
              shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
            })}
          >
            <View style={{
              width: 32, height: 32, borderRadius: 10,
              backgroundColor: "#F8F9FA",
              borderWidth: 1, borderColor: "#E8EAED",
              alignItems: "center", justifyContent: "center",
            }}>
              <ExpoImage source={images.googleIcon} style={{ width: 20, height: 20 }} contentFit="contain" />
            </View>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#1F2937", letterSpacing: 0.1 }}>Continue with Google</Text>
          </Pressable>

          {/* TikTok — dark branded */}
          <Pressable
            onPress={handleTikTokLogin}
            disabled={loading}
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", justifyContent: "center",
              backgroundColor: "#0D0D0D",
              borderRadius: 18,
              paddingVertical: 15, gap: 12,
              opacity: pressed || loading ? 0.7 : 1,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.22, shadowRadius: 12, elevation: 6,
            })}
          >
            <View style={{
              width: 32, height: 32, borderRadius: 10,
              backgroundColor: "rgba(255,255,255,0.1)",
              alignItems: "center", justifyContent: "center",
            }}>
              <ExpoImage source={images.tikTokIcon} style={{ width: 20, height: 20 }} contentFit="contain" />
            </View>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff", letterSpacing: 0.1 }}>Continue with TikTok</Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 22, gap: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#E2E8F0" }} />
          <Text style={{ fontSize: 12, color: "#94A3B8", fontWeight: "700", letterSpacing: 1 }}>OR</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#E2E8F0" }} />
        </View>

        {/* Form */}
        <View style={{ marginTop: 22, gap: 16 }}>
          {/* Email */}
          <View>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 8, letterSpacing: 0.2 }}>Email address</Text>
            <View style={{
              flexDirection: "row", alignItems: "center",
              backgroundColor: "#fff", borderRadius: 16,
              borderWidth: 1.5, borderColor: emailFocused ? colors.primary : "#E2E8F0",
              paddingHorizontal: 16, height: 56, gap: 10,
              shadowColor: emailFocused ? colors.primary : "#0F172A",
              shadowOffset: { width: 0, height: 2 }, shadowOpacity: emailFocused ? 0.12 : 0.04, shadowRadius: 6, elevation: emailFocused ? 3 : 1,
            }}>
              <Mail size={18} color={emailFocused ? colors.primary : "#94A3B8"} />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#CBD5E1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={{ flex: 1, fontSize: 15, color: colors.navy }}
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 8, letterSpacing: 0.2 }}>Password</Text>
            <View style={{
              flexDirection: "row", alignItems: "center",
              backgroundColor: "#fff", borderRadius: 16,
              borderWidth: 1.5, borderColor: passwordFocused ? colors.primary : "#E2E8F0",
              paddingHorizontal: 16, height: 56, gap: 10,
              shadowColor: passwordFocused ? colors.primary : "#0F172A",
              shadowOffset: { width: 0, height: 2 }, shadowOpacity: passwordFocused ? 0.12 : 0.04, shadowRadius: 6, elevation: passwordFocused ? 3 : 1,
            }}>
              <LockKeyhole size={18} color={passwordFocused ? colors.primary : "#94A3B8"} />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#CBD5E1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                onSubmitEditing={handleSignIn}
                returnKeyType="go"
                style={{ flex: 1, fontSize: 15, color: colors.navy }}
              />
              <Pressable onPress={() => setShowPassword((p) => !p)} hitSlop={10}>
                {showPassword
                  ? <EyeOff size={18} color="#94A3B8" />
                  : <Eye size={18} color="#94A3B8" />}
              </Pressable>
            </View>
          </View>
        </View>

        {/* Forgot password */}
        <Pressable
          onPress={() => router.push("/auth/forgot-password")}
          disabled={loading}
          style={{ marginTop: 14, alignSelf: "flex-end" }}
        >
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary }}>Forgot password?</Text>
        </Pressable>

        {/* CTA */}
        <Pressable
          onPress={handleSignIn}
          disabled={loading}
          style={({ pressed }) => ({
            marginTop: 28,
            backgroundColor: colors.primary,
            borderRadius: 18,
            paddingVertical: 18,
            alignItems: "center",
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 16,
            elevation: 10,
            opacity: pressed || loading ? 0.75 : 1,
          })}
        >
          <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.4 }}>
            {loading ? "Signing in…" : "Log In"}
          </Text>
        </Pressable>

        {/* Sign up link */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 22, gap: 4 }}>
          <Text style={{ fontSize: 14, color: "#94A3B8" }}>Don't have an account?</Text>
          <Pressable onPress={() => router.push("/auth/signup")} disabled={loading}>
            <Text style={{ fontSize: 14, fontWeight: "800", color: colors.primary }}> Sign up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
