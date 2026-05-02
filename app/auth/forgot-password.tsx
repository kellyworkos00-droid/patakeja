import { useEffect, useRef, useState } from "react";
import {
  Alert, BackHandler, Image, Pressable, ScrollView,
  StatusBar, Text, TextInput, View,
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft, Eye, EyeOff, HelpCircle, LockKeyhole, Mail, ShieldCheck } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useSignIn } from "@clerk/clerk-expo";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";

export default function ForgotPasswordScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [codeFocused, setCodeFocused] = useState(false);
  const [newPassFocused, setNewPassFocused] = useState(false);
  const [confirmPassFocused, setConfirmPassFocused] = useState(false);

  const codeRef = useRef<TextInput>(null);
  const newPasswordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const goBack = () => {
    if (step === "reset") {
      setStep("request");
      setCode(""); setNewPassword(""); setConfirmPassword("");
      setShowNewPassword(false); setShowConfirmPassword(false);
    } else {
      router.canGoBack() ? router.back() : router.replace("/auth/login");
    }
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (step === "reset") { goBack(); return true; }
      return false;
    });
    return () => sub.remove();
  }, [step]);

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

  const sendResetCode = async () => {
    if (!isLoaded) return;
    const normalizedEmail = email.trim().toLowerCase();
    if (!/\S+@\S+\.\S+/.test(normalizedEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await signIn.create({ strategy: "reset_password_email_code", identifier: normalizedEmail });
      setStep("reset");
      setTimeout(() => codeRef.current?.focus(), 120);
      Alert.alert("Code sent", "Check your email for a 6-digit verification code.");
    } catch (err: any) {
      Alert.alert("Reset failed", err.errors?.[0]?.message || "Could not send reset code.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!isLoaded) return;
    if (!code.trim()) { Alert.alert("Missing code", "Enter the verification code from your email."); return; }
    if (newPassword.length < 8) { Alert.alert("Weak password", "Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { Alert.alert("Passwords don't match", "Please confirm the same password."); return; }
    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
        password: newPassword,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        Alert.alert("Password updated", "Your password has been reset successfully.", [
          { text: "Log in", onPress: () => router.replace("/auth/login") },
        ]);
        return;
      }
      Alert.alert("Verification needed", "Please complete additional verification steps.");
    } catch (err: any) {
      Alert.alert("Reset failed", err.errors?.[0]?.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Nav bar */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 20, paddingTop: 6, paddingBottom: 10,
      }}>
        <Pressable
          onPress={goBack}
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
        {/* Hero */}
        <View style={{ marginBottom: 24, borderRadius: 28, overflow: "hidden" }}>
          <Image source={images.authHero} style={{ width: "100%", height: 210 }} resizeMode="cover" />
          <LinearGradient
            colors={["transparent", "rgba(15,23,42,0.5)"]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
          {/* Step dots */}
          <View style={{ position: "absolute", top: 16, right: 16 }}>
            <View style={{
              flexDirection: "row", gap: 6, alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 20,
              paddingHorizontal: 12, paddingVertical: 6,
            }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" }} />
              <View style={{
                width: 8, height: 8, borderRadius: 4,
                backgroundColor: step === "reset" ? "#fff" : "rgba(255,255,255,0.35)",
              }} />
            </View>
          </View>
          <View style={{ position: "absolute", bottom: 18, left: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: "700", color: "rgba(255,255,255,0.75)", letterSpacing: 1.5 }}>PATAKEJA</Text>
          </View>
        </View>

        {step === "request" ? (
          <>
            <Text style={{ fontSize: 32, fontWeight: "800", color: colors.navy, letterSpacing: -0.8, lineHeight: 40 }}>
              Forgot your{"\n"}password?
            </Text>
            <Text style={{ fontSize: 15, color: "#64748B", marginTop: 8, lineHeight: 24 }}>
              No worries — enter your email and we'll send a reset code.
            </Text>

            <View style={{ marginTop: 28 }}>
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
                  returnKeyType="send"
                  onSubmitEditing={sendResetCode}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  style={{ flex: 1, fontSize: 15, color: colors.navy }}
                />
              </View>
            </View>

            {/* Info notice */}
            <View style={{
              marginTop: 18, flexDirection: "row", gap: 12,
              backgroundColor: "#EFF6FF", borderRadius: 16,
              borderWidth: 1, borderColor: "#BFDBFE", padding: 14,
            }}>
              <ShieldCheck size={18} color="#3B82F6" strokeWidth={2.5} />
              <Text style={{ flex: 1, fontSize: 13, color: "#1D4ED8", fontWeight: "600", lineHeight: 20 }}>
                We'll send a secure 6-digit code to your email. It expires in 10 minutes.
              </Text>
            </View>

            <Pressable
              onPress={sendResetCode}
              disabled={loading || !email}
              style={({ pressed }) => ({
                marginTop: 28, backgroundColor: colors.primary,
                borderRadius: 18, paddingVertical: 18, alignItems: "center",
                shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
                opacity: pressed || loading || !email ? 0.65 : 1,
              })}
            >
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.4 }}>
                {loading ? "Sending code…" : "Send Reset Code"}
              </Text>
            </Pressable>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 22, gap: 4 }}>
              <Text style={{ fontSize: 14, color: "#94A3B8" }}>Remember your password?</Text>
              <Pressable onPress={() => router.replace("/auth/login")} disabled={loading}>
                <Text style={{ fontSize: 14, fontWeight: "800", color: colors.primary }}> Log in</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <>
            <Text style={{ fontSize: 32, fontWeight: "800", color: colors.navy, letterSpacing: -0.8, lineHeight: 40 }}>
              Create new{"\n"}password
            </Text>
            <Text style={{ fontSize: 15, color: "#64748B", marginTop: 8, lineHeight: 24 }}>
              Code sent to{" "}
              <Text style={{ fontWeight: "700", color: colors.navy }}>{email.trim().toLowerCase()}</Text>
            </Text>

            <View style={{ marginTop: 28, gap: 16 }}>
              {/* Code */}
              <View>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 8, letterSpacing: 0.2 }}>Verification code</Text>
                <View style={inputStyle(codeFocused)}>
                  <ShieldCheck size={18} color={codeFocused ? colors.primary : "#94A3B8"} />
                  <TextInput
                    ref={codeRef}
                    placeholder="6-digit code"
                    placeholderTextColor="#CBD5E1"
                    value={code}
                    onChangeText={(val) => {
                      const s = val.replace(/\D/g, "").slice(0, 6);
                      setCode(s);
                      if (s.length === 6) newPasswordRef.current?.focus();
                    }}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    maxLength={6}
                    returnKeyType="next"
                    onSubmitEditing={() => newPasswordRef.current?.focus()}
                    editable={!loading}
                    onFocus={() => setCodeFocused(true)}
                    onBlur={() => setCodeFocused(false)}
                    style={{ flex: 1, fontSize: 22, fontWeight: "800", color: colors.navy, letterSpacing: 8 }}
                  />
                  {code.length === 6 && (
                    <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 13, fontWeight: "800" }}>✓</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* New password */}
              <View>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 8, letterSpacing: 0.2 }}>New password</Text>
                <View style={inputStyle(newPassFocused)}>
                  <LockKeyhole size={18} color={newPassFocused ? colors.primary : "#94A3B8"} />
                  <TextInput
                    ref={newPasswordRef}
                    placeholder="At least 8 characters"
                    placeholderTextColor="#CBD5E1"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNewPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={128}
                    returnKeyType="next"
                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                    editable={!loading}
                    onFocus={() => setNewPassFocused(true)}
                    onBlur={() => setNewPassFocused(false)}
                    style={{ flex: 1, fontSize: 15, color: colors.navy }}
                  />
                  <Pressable onPress={() => setShowNewPassword((p) => !p)} hitSlop={10}>
                    {showNewPassword ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
                  </Pressable>
                </View>
              </View>

              {/* Confirm password */}
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, letterSpacing: 0.2 }}>Confirm password</Text>
                  {confirmPassword.length > 0 && (
                    <Text style={{
                      fontSize: 11, fontWeight: "800", letterSpacing: 0.3,
                      color: newPassword === confirmPassword ? colors.primary : "#EF4444",
                    }}>
                      {newPassword === confirmPassword ? "Matches ✓" : "No match"}
                    </Text>
                  )}
                </View>
                <View style={inputStyle(confirmPassFocused)}>
                  <LockKeyhole size={18} color={confirmPassFocused ? colors.primary : "#94A3B8"} />
                  <TextInput
                    ref={confirmPasswordRef}
                    placeholder="Re-enter new password"
                    placeholderTextColor="#CBD5E1"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={128}
                    returnKeyType="done"
                    onSubmitEditing={resetPassword}
                    editable={!loading}
                    onFocus={() => setConfirmPassFocused(true)}
                    onBlur={() => setConfirmPassFocused(false)}
                    style={{ flex: 1, fontSize: 15, color: colors.navy }}
                  />
                  <Pressable onPress={() => setShowConfirmPassword((p) => !p)} hitSlop={10}>
                    {showConfirmPassword ? <EyeOff size={18} color="#94A3B8" /> : <Eye size={18} color="#94A3B8" />}
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Reset CTA */}
            <Pressable
              onPress={resetPassword}
              disabled={loading || !code || !newPassword || !confirmPassword}
              style={({ pressed }) => ({
                marginTop: 28, backgroundColor: colors.primary,
                borderRadius: 18, paddingVertical: 18, alignItems: "center",
                shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
                opacity: pressed || loading || !code || !newPassword || !confirmPassword ? 0.65 : 1,
              })}
            >
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.4 }}>
                {loading ? "Resetting password…" : "Reset Password"}
              </Text>
            </Pressable>

            {/* Secondary */}
            <View style={{ marginTop: 14, gap: 8 }}>
              <Pressable
                onPress={sendResetCode}
                disabled={loading}
                style={({ pressed }) => ({
                  borderRadius: 16, borderWidth: 1.5, borderColor: "#E2E8F0",
                  paddingVertical: 15, alignItems: "center", backgroundColor: "#fff",
                  opacity: pressed || loading ? 0.65 : 1,
                })}
              >
                <Text style={{ fontSize: 15, fontWeight: "700", color: colors.navy }}>Resend Code</Text>
              </Pressable>

              <Pressable
                onPress={() => { setStep("request"); setCode(""); setNewPassword(""); setConfirmPassword(""); }}
                disabled={loading}
                style={{ paddingVertical: 12, alignItems: "center" }}
              >
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#64748B" }}>Use a different email</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
