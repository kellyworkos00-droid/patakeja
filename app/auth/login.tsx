import { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View, TextInput, Alert } from "react-native";
import { router } from "expo-router";
import { LockKeyhole, Mail, ArrowLeft } from "lucide-react-native";
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
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useWarmUpBrowser();

  const handleSignIn = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      if (completeSignIn.status === "complete") {
        await setActive({ session: completeSignIn.createdSessionId });
        router.replace("/tabs/home");
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleFlow();
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
        router.replace("/tabs/home");
      }
    } catch (err) {
      Alert.alert("Error", "Google login failed");
    }
  };

  const handleTikTokLogin = async () => {
    try {
      const { createdSessionId, setActive } = await startTikTokFlow();
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
        router.replace("/tabs/home");
      }
    } catch (err) {
      Alert.alert("Error", "TikTok login failed");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header with back button */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingTop: 12, paddingBottom: 16 }}>
        <Pressable onPress={() => router.back()} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#F1F5F9", alignItems: "center", justifyContent: "center" }}>
          <ArrowLeft size={20} color={colors.navy} />
        </Pressable>
        <Pressable onPress={() => router.push("/settings")}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary, letterSpacing: 0.3 }}>HELP</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: Math.max(insets.bottom + 16, 28) }} showsVerticalScrollIndicator={false}>
        
        {/* Hero image */}
        <View style={{ marginBottom: 26, borderRadius: 28, overflow: "hidden" }}>
          <Image source={images.loginDirection} style={{ width: "100%", height: 200 }} resizeMode="cover" />
          <LinearGradient
            colors={["rgba(0,0,0,0.15)", "transparent"]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
        </View>

        {/* Greeting */}
        <Text style={{ fontSize: 28, fontWeight: "800", color: colors.navy, lineHeight: 36, letterSpacing: -0.5 }}>
          Welcome{"\n"}back!
        </Text>
        <Text style={{ fontSize: 14, color: "#64748B", marginTop: 8, lineHeight: 23 }}>
          Log in to continue searching for your perfect home.
        </Text>

        {/* Social Login Buttons */}
        <View style={{ marginTop: 24, gap: 10 }}>
          <Pressable
            onPress={handleGoogleLogin}
            disabled={loading}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#F8FAFC",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              paddingVertical: 14,
              gap: 8,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
              <ExpoImage source={images.googleIcon} style={{ width: 18, height: 18 }} contentFit="contain" />
            </View>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.navy }}>Continue with Google</Text>
          </Pressable>

          <Pressable
            onPress={handleTikTokLogin}
            disabled={loading}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#F8FAFC",
              borderRadius: 16,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              paddingVertical: 14,
              gap: 8,
              opacity: loading ? 0.6 : 1,
            }}
          >
            <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
              <ExpoImage source={images.tikTokIcon} style={{ width: 18, height: 18 }} contentFit="contain" />
            </View>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.navy }}>Continue with TikTok</Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 20, gap: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#E2E8F0" }} />
          <Text style={{ fontSize: 12, color: "#94A3B8", fontWeight: "600" }}>OR</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#E2E8F0" }} />
        </View>

        {/* Form */}
        <View style={{ marginTop: 20, gap: 14 }}>
          <View>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 8, letterSpacing: 0.2 }}>Email Address</Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 16, height: 52, gap: 10 }}>
              <Mail size={18} color="#94A3B8" />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#CBD5E1"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
                style={{ flex: 1, fontSize: 15, color: colors.navy }}
              />
            </View>
          </View>

          <View>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 8, letterSpacing: 0.2 }}>Password</Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 16, height: 52, gap: 10 }}>
              <LockKeyhole size={18} color="#94A3B8" />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#CBD5E1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                style={{ flex: 1, fontSize: 15, color: colors.navy }}
              />
            </View>
          </View>
        </View>

        {/* Forgot password link */}
        <Pressable onPress={() => router.push("/auth/forgot-password")} style={{ marginTop: 12 }} disabled={loading}>
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary, letterSpacing: 0.2, opacity: loading ? 0.6 : 1 }}>Forgot password?</Text>
        </Pressable>

        {/* Log in button */}
        <Pressable
          onPress={handleSignIn}
          disabled={loading}
          style={{
            marginTop: 28,
            backgroundColor: colors.primary,
            borderRadius: 18,
            paddingVertical: 17,
            alignItems: "center",
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 14,
            elevation: 8,
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.3 }}>
            {loading ? "Signing in..." : "Log In"}
          </Text>
        </Pressable>

        {/* Sign up link */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20, gap: 4 }}>
          <Text style={{ fontSize: 14, color: "#64748B" }}>Don't have an account?</Text>
          <Pressable onPress={() => router.push("/auth/signup")} disabled={loading}>
            <Text style={{ fontSize: 14, fontWeight: "800", color: colors.primary, opacity: loading ? 0.6 : 1 }}> Sign up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
