import { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View, TextInput, Alert } from "react-native";
import { router } from "expo-router";
import { LockKeyhole, Mail, UserRound, ArrowLeft, Check, Eye, EyeOff, HelpCircle } from "lucide-react-native";
import { Image as ExpoImage } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useSignUp, useOAuth } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";

export const useWarmUpBrowser = () => {
  WebBrowser.maybeCompleteAuthSession();
};

export default function SignupScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startTikTokFlow } = useOAuth({ strategy: "oauth_tiktok" });

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useWarmUpBrowser();

  const passwordStrength =
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
      ? "strong"
      : password.length >= 6
      ? "medium"
      : "weak";
  const passwordColor =
    passwordStrength === "strong" ? colors.primary : passwordStrength === "medium" ? "#F59E0B" : "#EF4444";

  const handleSignUp = async () => {
    if (!isLoaded) return;
    if (!fullName.trim() || !email.trim() || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await signUp.create({
        firstName: fullName.trim().split(" ")[0],
        lastName: fullName.trim().split(" ").slice(1).join(" "),
        emailAddress: email.trim(),
        password,
      });
      if (signUp.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
        router.replace("/tabs/home");
      }
    } catch (err: any) {
      Alert.alert("Signup failed", err.errors?.[0]?.message || "Could not create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleFlow();
      if (createdSessionId) { setActive?.({ session: createdSessionId }); router.replace("/tabs/home"); }
    } catch { Alert.alert("Error", "Google signup failed"); }
  };

  const handleTikTokSignup = async () => {
    try {
      const { createdSessionId, setActive } = await startTikTokFlow();
      if (createdSessionId) { setActive?.({ session: createdSessionId }); router.replace("/tabs/home"); }
    } catch { Alert.alert("Error", "TikTok signup failed"); }
  };

  const inputStyle = (focused: boolean) => ({
    flexDirection: "row" as const, alignItems: "center" as const,
    backgroundColor: "#fff", borderRadius: 16,
    borderWidth: 1.5, borderColor: focused ? colors.primary : "#E2E8F0",
    paddingHorizontal: 16, height: 56, gap: 10,
    shadowColor: focused ? colors.primary : "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: focused ? 0.12 : 0.04,
    shadowRadius: 6, elevation: focused ? 3 : 1,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ── Nav bar ── */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 20, paddingTop: 6, paddingBottom: 10,
      }}>
        <Pressable
          onPress={() => router.back()}
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
          <Image source={images.signupDirection} style={{ width: "100%", height: 210 }} resizeMode="cover" />
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
          Create your{"\n"}account
        </Text>
        <Text style={{ fontSize: 15, color: "#64748B", marginTop: 8, lineHeight: 24 }}>
          Start with a secure PataKeja profile.
        </Text>

        {/* Social buttons */}
        <View style={{ marginTop: 26, gap: 11 }}>
          <Pressable
            onPress={handleGoogleSignup}
            disabled={loading}
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", justifyContent: "center",
              backgroundColor: "#fff",
              borderRadius: 18, borderWidth: 1.5, borderColor: "#E2E8F0",
              paddingVertical: 15, gap: 10,
              opacity: pressed || loading ? 0.75 : 1,
              shadowColor: "#0F172A", shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
            })}
          >
            <View style={{ width: 26, height: 26, alignItems: "center", justifyContent: "center" }}>
              <ExpoImage source={images.googleIcon} style={{ width: 22, height: 22 }} contentFit="contain" />
            </View>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.navy }}>Sign up with Google</Text>
          </Pressable>

          <Pressable
            onPress={handleTikTokSignup}
            disabled={loading}
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", justifyContent: "center",
              backgroundColor: "#fff",
              borderRadius: 18, borderWidth: 1.5, borderColor: "#E2E8F0",
              paddingVertical: 15, gap: 10,
              opacity: pressed || loading ? 0.75 : 1,
              shadowColor: "#0F172A", shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
            })}
          >
            <View style={{ width: 26, height: 26, alignItems: "center", justifyContent: "center" }}>
              <ExpoImage source={images.tikTokIcon} style={{ width: 22, height: 22 }} contentFit="contain" />
            </View>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.navy }}>Sign up with TikTok</Text>
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
          {/* Full name */}
          <View>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 8, letterSpacing: 0.2 }}>Full name</Text>
            <View style={inputStyle(nameFocused)}>
              <UserRound size={18} color={nameFocused ? colors.primary : "#94A3B8"} />
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor="#CBD5E1"
                value={fullName}
                onChangeText={setFullName}
                editable={!loading}
                autoCorrect={false}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                returnKeyType="next"
                style={{ flex: 1, fontSize: 15, color: colors.navy }}
              />
            </View>
          </View>

          {/* Email */}
          <View>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 8, letterSpacing: 0.2 }}>Email address</Text>
            <View style={inputStyle(emailFocused)}>
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
                returnKeyType="next"
                style={{ flex: 1, fontSize: 15, color: colors.navy }}
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, letterSpacing: 0.2 }}>Password</Text>
              {password.length > 0 && (
                <Text style={{ fontSize: 11, fontWeight: "800", color: passwordColor, letterSpacing: 0.3 }}>
                  {passwordStrength === "strong" ? "Strong" : passwordStrength === "medium" ? "Medium" : "Weak"}
                </Text>
              )}
            </View>
            <View style={inputStyle(passwordFocused)}>
              <LockKeyhole size={18} color={passwordFocused ? colors.primary : "#94A3B8"} />
              <TextInput
                placeholder="Create a secure password"
                placeholderTextColor="#CBD5E1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
                style={{ flex: 1, fontSize: 15, color: colors.navy }}
              />
              <Pressable onPress={() => setShowPassword((p) => !p)} hitSlop={10}>
                {showPassword ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
              </Pressable>
            </View>
            {/* Strength bar */}
            <View style={{ marginTop: 10, flexDirection: "row", gap: 5 }}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  backgroundColor:
                    passwordStrength === "strong" ? colors.primary
                    : passwordStrength === "medium" && i < 2 ? "#F59E0B"
                    : password.length > 0 && i === 0 ? "#EF4444"
                    : "#E2E8F0",
                }} />
              ))}
            </View>
            <Text style={{ fontSize: 12, color: "#94A3B8", marginTop: 8, lineHeight: 20 }}>
              Min. 8 characters, 1 uppercase letter and 1 number.
            </Text>
          </View>
        </View>

        {/* Privacy notice */}
        <View style={{
          marginTop: 20, flexDirection: "row", gap: 12,
          backgroundColor: "#F0FDF4", borderRadius: 16,
          borderWidth: 1, borderColor: "#BBF7D0",
          padding: 14,
        }}>
          <View style={{
            width: 22, height: 22, borderRadius: 11,
            backgroundColor: colors.primary,
            alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Check size={13} color="#fff" strokeWidth={3} />
          </View>
          <Text style={{ flex: 1, fontSize: 13, color: "#166534", fontWeight: "600", lineHeight: 20 }}>
            Your contact details stay private. All communication happens securely inside PataKeja.
          </Text>
        </View>

        {/* CTA */}
        <Pressable
          onPress={handleSignUp}
          disabled={loading || !fullName || !email || !password}
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
            opacity: pressed || loading || !fullName || !email || !password ? 0.65 : 1,
          })}
        >
          <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.4 }}>
            {loading ? "Creating account…" : "Create Account"}
          </Text>
        </Pressable>

        {/* Log in link */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 22, gap: 4 }}>
          <Text style={{ fontSize: 14, color: "#94A3B8" }}>Already have an account?</Text>
          <Pressable onPress={() => router.push("/auth/login")} disabled={loading}>
            <Text style={{ fontSize: 14, fontWeight: "800", color: colors.primary }}> Log in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export const useWarmUpBrowser = () => {
  WebBrowser.maybeCompleteAuthSession();
};

export default function SignupScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startTikTokFlow } = useOAuth({ strategy: "oauth_tiktok" });
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  useWarmUpBrowser();

  const passwordStrength =
    password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? "strong" : password.length >= 6 ? "medium" : "weak";
  const passwordColor = passwordStrength === "strong" ? colors.primary : passwordStrength === "medium" ? "#F59E0B" : "#EF4444";

  const handleSignUp = async () => {
    if (!isLoaded) return;
    setLoading(true);

    try {
      await signUp.create({
        firstName: fullName.split(" ")[0],
        lastName: fullName.split(" ").slice(1).join(" "),
        emailAddress: email,
        password,
      });

      if (signUp.status === "complete") {
        await setActive({ session: signUp.createdSessionId });
        router.replace("/tabs/home");
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleFlow();
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
        router.replace("/tabs/home");
      }
    } catch (err) {
      Alert.alert("Error", "Google signup failed");
    }
  };

  const handleTikTokSignup = async () => {
    try {
      const { createdSessionId, setActive } = await startTikTokFlow();
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
        router.replace("/tabs/home");
      }
    } catch (err) {
      Alert.alert("Error", "TikTok signup failed");
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
          <Image source={images.signupDirection} style={{ width: "100%", height: 200 }} resizeMode="cover" />
          <LinearGradient
            colors={["rgba(0,0,0,0.15)", "transparent"]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
        </View>

        {/* Heading */}
        <Text style={{ fontSize: 28, fontWeight: "800", color: colors.navy, lineHeight: 36, letterSpacing: -0.5 }}>
          Create your{"\n"}account
        </Text>
        <Text style={{ fontSize: 14, color: "#64748B", marginTop: 8, lineHeight: 23 }}>
          Start with a secure PataKeja profile to search and connect with homes.
        </Text>

        {/* Social Login Buttons */}
        <View style={{ marginTop: 24, gap: 10 }}>
          <Pressable
            onPress={handleGoogleSignup}
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
            <Text style={{ fontSize: 18 }}>🔵</Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.navy }}>Sign up with Google</Text>
          </Pressable>

          <Pressable
            onPress={handleTikTokSignup}
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
            <Text style={{ fontSize: 18 }}>♪</Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.navy }}>Sign up with TikTok</Text>
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
          {/* Full Name */}
          <View>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 8, letterSpacing: 0.2 }}>Full Name</Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 16, height: 52, gap: 10 }}>
              <UserRound size={18} color="#94A3B8" />
              <TextInput
                placeholder="Enter your full name"
                placeholderTextColor="#CBD5E1"
                value={fullName}
                onChangeText={setFullName}
                editable={!loading}
                style={{ flex: 1, fontSize: 15, color: colors.navy }}
              />
            </View>
          </View>

          {/* Email */}
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

          {/* Password */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, letterSpacing: 0.2 }}>Password</Text>
              {password.length > 0 && (
                <Text style={{ fontSize: 11, fontWeight: "700", color: passwordColor, letterSpacing: 0.2 }}>
                  {passwordStrength === "strong" ? "Strong" : passwordStrength === "medium" ? "Medium" : "Weak"}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#F8FAFC", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 16, height: 52, gap: 10 }}>
              <LockKeyhole size={18} color="#94A3B8" />
              <TextInput
                placeholder="Create a secure password"
                placeholderTextColor="#CBD5E1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
                style={{ flex: 1, fontSize: 15, color: colors.navy }}
              />
            </View>
            {/* Password strength bar */}
            <View style={{ marginTop: 8, flexDirection: "row", gap: 5 }}>
              {[0, 1, 2].map((i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor:
                      passwordStrength === "strong"
                        ? colors.primary
                        : passwordStrength === "medium" && i < 2
                        ? "#F59E0B"
                        : password.length > 0 && i === 0
                        ? "#EF4444"
                        : "#E2E8F0",
                  }}
                />
              ))}
            </View>
            <Text style={{ fontSize: 12, color: "#64748B", marginTop: 8, lineHeight: 20 }}>
              At least 8 characters, 1 uppercase letter, and 1 number
            </Text>
          </View>
        </View>

        {/* Safety notice */}
        <View style={{ marginTop: 20, flexDirection: "row", gap: 10, backgroundColor: "#DCFCE7", borderRadius: 16, padding: 12 }}>
          <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
            <Check size={12} color="#fff" />
          </View>
          <Text style={{ flex: 1, fontSize: 12, color: colors.primary, fontWeight: "600", lineHeight: 19 }}>
            Your contact details stay private. All communication happens inside PataKeja.
          </Text>
        </View>

        {/* Create account button */}
        <Pressable
          onPress={handleSignUp}
          disabled={loading || !fullName || !email || !password}
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
            opacity: fullName && email && password && !loading ? 1 : 0.6,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.3 }}>
            {loading ? "Creating account..." : "Create Account"}
          </Text>
        </Pressable>

        {/* Log in link */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 20, gap: 4 }}>
          <Text style={{ fontSize: 14, color: "#64748B" }}>Already have an account?</Text>
          <Pressable onPress={() => router.push("/auth/login")} disabled={loading}>
            <Text style={{ fontSize: 14, fontWeight: "800", color: colors.primary, opacity: loading ? 0.6 : 1 }}> Log in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
