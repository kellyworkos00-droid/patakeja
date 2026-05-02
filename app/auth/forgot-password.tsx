import { useEffect, useRef, useState } from "react";
import {
  Alert, BackHandler, Image, Pressable, ScrollView,
  StatusBar, Text, TextInput, View,
} from "react-native";
import { router } from "expo-router";
import {
  ArrowLeft, CheckCircle2, Eye, EyeOff,
  HelpCircle, LockKeyhole, Mail, RefreshCcw, ShieldCheck,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useSignIn } from "@clerk/clerk-expo";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";

type Step = "request" | "verify" | "success";

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,
};

const shadowGreen = {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.35,
  shadowRadius: 18,
  elevation: 10,
};

export default function ForgotPasswordScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailFocused, setEmailFocused] = useState(false);
  const [codeFocused, setCodeFocused] = useState(false);
  const [newFocused, setNewFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const codeRef = useRef<TextInput>(null);
  const newRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const passwordStrength =
    newPassword.length >= 8 && /[A-Z]/.test(newPassword) && /[0-9]/.test(newPassword)
      ? "strong"
      : newPassword.length >= 6
      ? "medium"
      : "weak";

  const strengthColor =
    passwordStrength === "strong" ? colors.primary
    : passwordStrength === "medium" ? "#F59E0B"
    : "#EF4444";

  const goBack = () => {
    if (step === "verify") {
      setStep("request");
      setCode(""); setNewPassword(""); setConfirmPassword("");
    } else if (step === "success") {
      router.replace("/auth/login");
    } else {
      router.canGoBack() ? router.back() : router.replace("/auth/login");
    }
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (step === "verify") { goBack(); return true; }
      return false;
    });
    return () => sub.remove();
  }, [step]);

  const inputStyle = (focused: boolean) => ({
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: focused ? colors.primary : "#E2E8F0",
    paddingHorizontal: 16,
    height: 58,
    gap: 12,
    shadowColor: focused ? colors.primary : "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: focused ? 0.14 : 0.04,
    shadowRadius: 8,
    elevation: focused ? 4 : 1,
  });

  const sendCode = async () => {
    if (!isLoaded) return;
    const trimmed = email.trim().toLowerCase();
    if (!/\S+@\S+\.\S+/.test(trimmed)) {
      Alert.alert("Invalid email", "Please enter a valid email address."); return;
    }
    setLoading(true);
    try {
      await signIn.create({ strategy: "reset_password_email_code", identifier: trimmed });
      setStep("verify");
      setTimeout(() => codeRef.current?.focus(), 200);
    } catch (err: any) {
      Alert.alert("Failed to send", err.errors?.[0]?.message || "Could not send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!isLoaded) return;
    if (code.length < 6) { Alert.alert("Invalid code", "Enter the full 6-digit code."); return; }
    if (newPassword.length < 8) { Alert.alert("Weak password", "Password must be at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { Alert.alert("Passwords don't match", "Please make sure both passwords match."); return; }
    setLoading(true);
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: code.trim(),
        password: newPassword,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        setStep("success");
      } else {
        Alert.alert("More steps needed", "Please complete additional verification.");
      }
    } catch (err: any) {
      Alert.alert("Reset failed", err.errors?.[0]?.message || "Could not reset password. Check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const stepIndex = step === "request" ? 0 : step === "verify" ? 1 : 2;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }} edges={["top", "left", "right", "bottom"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Top nav */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 20, paddingTop: 6, paddingBottom: 8,
      }}>
        <Pressable
          onPress={goBack}
          style={[{
            width: 44, height: 44, borderRadius: 22,
            backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2E8F0",
            alignItems: "center", justifyContent: "center",
          }, shadow]}
        >
          <ArrowLeft size={20} color={colors.navy} strokeWidth={2.5} />
        </Pressable>

        <Pressable
          onPress={() => router.push("/settings")}
          style={[{
            flexDirection: "row", alignItems: "center", gap: 5,
            backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2E8F0",
            borderRadius: 22, paddingHorizontal: 14, paddingVertical: 9,
          }, shadow]}
        >
          <HelpCircle size={15} color={colors.primary} strokeWidth={2.5} />
          <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary }}>Help</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom + 24, 32) }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <View style={{ marginBottom: 22, borderRadius: 28, overflow: "hidden" }}>
          <Image source={images.authHero} style={{ width: "100%", height: 190 }} resizeMode="cover" />
          <LinearGradient
            colors={["transparent", "rgba(15,23,42,0.6)"]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
          <View style={{ position: "absolute", bottom: 16, left: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: "800", color: "rgba(255,255,255,0.8)", letterSpacing: 2 }}>PATAKEJA</Text>
          </View>
        </View>

        {/* Step progress */}
        <View style={{ flexDirection: "row", gap: 6, marginBottom: 28 }}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={{
                flex: 1, height: 4, borderRadius: 2,
                backgroundColor: i <= stepIndex ? colors.primary : "#E2E8F0",
              }}
            />
          ))}
        </View>

        {/* ── STEP 1: Request ── */}
        {step === "request" && (
          <>
            <View style={[{
              width: 68, height: 68, borderRadius: 24,
              backgroundColor: "#EFF6FF", borderWidth: 1.5, borderColor: "#BFDBFE",
              alignItems: "center", justifyContent: "center", marginBottom: 20,
              shadowColor: "#3B82F6", shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.18, shadowRadius: 16, elevation: 6,
            }]}>
              <Mail size={30} color="#3B82F6" strokeWidth={2} />
            </View>

            <Text style={{ fontSize: 34, fontWeight: "800", color: colors.navy, letterSpacing: -1, lineHeight: 42 }}>
              {"Forgot your\npassword?"}
            </Text>
            <Text style={{ fontSize: 15, color: "#64748B", marginTop: 8, lineHeight: 24 }}>
              Enter your email address and we'll send you a secure 6-digit reset code.
            </Text>

            <View style={{ marginTop: 28 }}>
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 8 }}>Email address</Text>
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
                  onSubmitEditing={sendCode}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  style={{ flex: 1, fontSize: 15, color: colors.navy }}
                />
              </View>
            </View>

            <View style={[{
              marginTop: 16, backgroundColor: "#EFF6FF",
              borderRadius: 18, borderWidth: 1.5, borderColor: "#BFDBFE", padding: 16,
              shadowColor: "#3B82F6", shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1, shadowRadius: 10, elevation: 3,
            }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#DBEAFE", alignItems: "center", justifyContent: "center" }}>
                  <ShieldCheck size={16} color="#2563EB" strokeWidth={2.5} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: "800", color: "#1E40AF" }}>Secure reset process</Text>
              </View>
              <Text style={{ fontSize: 13, color: "#1D4ED8", fontWeight: "500", lineHeight: 20 }}>
                {"A "}
                <Text style={{ fontWeight: "800" }}>6-digit code</Text>
                {" will be sent to your email. It expires in "}
                <Text style={{ fontWeight: "800" }}>10 minutes</Text>
                {". Check spam if it doesn't arrive."}
              </Text>
            </View>

            <Pressable
              onPress={sendCode}
              disabled={loading || !email.trim()}
              style={({ pressed }) => ({ marginTop: 28, opacity: pressed || loading || !email.trim() ? 0.65 : 1 })}
            >
              <View style={[{ borderRadius: 20, paddingVertical: 18, alignItems: "center", backgroundColor: colors.primary }, shadowGreen]}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.3 }}>
                  {loading ? "Sending…" : "Send Reset Code"}
                </Text>
              </View>
            </Pressable>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 22, gap: 4 }}>
              <Text style={{ fontSize: 14, color: "#94A3B8" }}>Remember your password?</Text>
              <Pressable onPress={() => router.replace("/auth/login")} disabled={loading}>
                <Text style={{ fontSize: 14, fontWeight: "800", color: colors.primary }}>{" Log in"}</Text>
              </Pressable>
            </View>
          </>
        )}

        {/* ── STEP 2: Verify + New Password ── */}
        {step === "verify" && (
          <>
            <View style={[{
              width: 68, height: 68, borderRadius: 24,
              backgroundColor: "#F0FDF4", borderWidth: 1.5, borderColor: "#BBF7D0",
              alignItems: "center", justifyContent: "center", marginBottom: 20,
              shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.18, shadowRadius: 16, elevation: 6,
            }]}>
              <LockKeyhole size={30} color={colors.primary} strokeWidth={2} />
            </View>

            <Text style={{ fontSize: 34, fontWeight: "800", color: colors.navy, letterSpacing: -1, lineHeight: 42 }}>
              {"Create new\npassword"}
            </Text>
            <Text style={{ fontSize: 15, color: "#64748B", marginTop: 8, lineHeight: 24 }}>
              Enter the code sent to your email.
            </Text>

            <View style={{
              marginTop: 10, alignSelf: "flex-start",
              flexDirection: "row", alignItems: "center", gap: 6,
              backgroundColor: "#F0FDF4", borderRadius: 12,
              borderWidth: 1, borderColor: "#BBF7D0",
              paddingHorizontal: 12, paddingVertical: 6,
            }}>
              <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: colors.primary }} />
              <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary }}>{email.trim().toLowerCase()}</Text>
            </View>

            <View style={{ marginTop: 28, gap: 18 }}>

              {/* Code input */}
              <View>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 8 }}>Verification code</Text>
                <View style={inputStyle(codeFocused)}>
                  <ShieldCheck size={18} color={codeFocused ? colors.primary : "#94A3B8"} />
                  <TextInput
                    ref={codeRef}
                    placeholder="● ● ● ● ● ●"
                    placeholderTextColor="#CBD5E1"
                    value={code}
                    onChangeText={(v) => {
                      const s = v.replace(/\D/g, "").slice(0, 6);
                      setCode(s);
                      if (s.length === 6) newRef.current?.focus();
                    }}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    maxLength={6}
                    returnKeyType="next"
                    editable={!loading}
                    onFocus={() => setCodeFocused(true)}
                    onBlur={() => setCodeFocused(false)}
                    style={{ flex: 1, fontSize: 24, fontWeight: "800", color: colors.navy, letterSpacing: 10 }}
                  />
                  {code.length === 6 && (
                    <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 14, fontWeight: "800" }}>✓</Text>
                    </View>
                  )}
                </View>
                <View style={{ flexDirection: "row", gap: 4, marginTop: 8 }}>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <View key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < code.length ? colors.primary : "#E2E8F0" }} />
                  ))}
                </View>
                <Pressable onPress={sendCode} disabled={loading} style={{ marginTop: 8, alignSelf: "flex-end" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                    <RefreshCcw size={13} color={colors.primary} />
                    <Text style={{ fontSize: 13, fontWeight: "700", color: colors.primary }}>Resend code</Text>
                  </View>
                </Pressable>
              </View>

              {/* New password */}
              <View>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy, marginBottom: 8 }}>New password</Text>
                <View style={inputStyle(newFocused)}>
                  <LockKeyhole size={18} color={newFocused ? colors.primary : "#94A3B8"} />
                  <TextInput
                    ref={newRef}
                    placeholder="At least 8 characters"
                    placeholderTextColor="#CBD5E1"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry={!showNew}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={128}
                    returnKeyType="next"
                    onSubmitEditing={() => confirmRef.current?.focus()}
                    editable={!loading}
                    onFocus={() => setNewFocused(true)}
                    onBlur={() => setNewFocused(false)}
                    style={{ flex: 1, fontSize: 15, color: colors.navy }}
                  />
                  <Pressable onPress={() => setShowNew((p) => !p)} hitSlop={10}>
                    {showNew
                      ? <EyeOff size={18} color="#94A3B8" />
                      : <Eye size={18} color="#94A3B8" />
                    }
                  </Pressable>
                </View>
                {newPassword.length > 0 && (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: "#E2E8F0", overflow: "hidden" }}>
                      <View style={{
                        height: 4, borderRadius: 2,
                        backgroundColor: strengthColor,
                        width: passwordStrength === "strong" ? "100%" : passwordStrength === "medium" ? "60%" : "25%",
                      }} />
                    </View>
                    <Text style={{ fontSize: 11, fontWeight: "800", color: strengthColor, width: 44 }}>
                      {passwordStrength === "strong" ? "Strong" : passwordStrength === "medium" ? "Fair" : "Weak"}
                    </Text>
                  </View>
                )}
              </View>

              {/* Confirm password */}
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.navy }}>Confirm password</Text>
                  {confirmPassword.length > 0 && (
                    <Text style={{ fontSize: 11, fontWeight: "800", color: newPassword === confirmPassword ? colors.primary : "#EF4444" }}>
                      {newPassword === confirmPassword ? "Matches ✓" : "No match"}
                    </Text>
                  )}
                </View>
                <View style={inputStyle(confirmFocused)}>
                  <LockKeyhole size={18} color={confirmFocused ? colors.primary : "#94A3B8"} />
                  <TextInput
                    ref={confirmRef}
                    placeholder="Re-enter new password"
                    placeholderTextColor="#CBD5E1"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={128}
                    returnKeyType="done"
                    onSubmitEditing={resetPassword}
                    editable={!loading}
                    onFocus={() => setConfirmFocused(true)}
                    onBlur={() => setConfirmFocused(false)}
                    style={{ flex: 1, fontSize: 15, color: colors.navy }}
                  />
                  <Pressable onPress={() => setShowConfirm((p) => !p)} hitSlop={10}>
                    {showConfirm
                      ? <EyeOff size={18} color="#94A3B8" />
                      : <Eye size={18} color="#94A3B8" />
                    }
                  </Pressable>
                </View>
              </View>
            </View>

            <Pressable
              onPress={resetPassword}
              disabled={loading || code.length < 6 || !newPassword || !confirmPassword}
              style={({ pressed }) => ({
                marginTop: 28,
                opacity: pressed || loading || code.length < 6 || !newPassword || !confirmPassword ? 0.65 : 1,
              })}
            >
              <View style={[{ borderRadius: 20, paddingVertical: 18, alignItems: "center", backgroundColor: colors.primary }, shadowGreen]}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.3 }}>
                  {loading ? "Resetting…" : "Reset Password"}
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => { setStep("request"); setCode(""); setNewPassword(""); setConfirmPassword(""); }}
              disabled={loading}
              style={{ marginTop: 14, paddingVertical: 12, alignItems: "center" }}
            >
              <Text style={{ fontSize: 14, fontWeight: "600", color: "#64748B" }}>Use a different email</Text>
            </Pressable>
          </>
        )}

        {/* ── STEP 3: Success ── */}
        {step === "success" && (
          <>
            <View style={{ alignItems: "center", marginTop: 16, marginBottom: 32 }}>
              <View style={[{
                width: 100, height: 100, borderRadius: 36,
                backgroundColor: "#F0FDF4", borderWidth: 2, borderColor: "#BBF7D0",
                alignItems: "center", justifyContent: "center",
              }, { shadowColor: colors.primary, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.25, shadowRadius: 24, elevation: 10 }]}>
                <CheckCircle2 size={52} color={colors.primary} strokeWidth={1.8} />
              </View>
              <View style={{
                position: "absolute", width: 130, height: 130, borderRadius: 65,
                borderWidth: 1, borderColor: "#BBF7D0", top: -15,
              }} />
            </View>

            <Text style={{ fontSize: 34, fontWeight: "800", color: colors.navy, letterSpacing: -1, lineHeight: 42, textAlign: "center" }}>
              {"Password\nreset!"}
            </Text>
            <Text style={{ fontSize: 15, color: "#64748B", marginTop: 10, lineHeight: 24, textAlign: "center" }}>
              Your password has been successfully updated. You're all set to log in.
            </Text>

            <View style={[{
              marginTop: 28, backgroundColor: "#F0FDF4",
              borderRadius: 20, borderWidth: 1.5, borderColor: "#BBF7D0",
              padding: 18, gap: 14,
            }, shadow]}>
              {[
                { Icon: ShieldCheck, text: "Your account is now secured with the new password." },
                { Icon: Mail, text: "All active sessions have been invalidated for safety." },
                { Icon: LockKeyhole, text: "Use your new password to log in going forward." },
              ].map(({ Icon, text }, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                  <View style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: "#DCFCE7", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={15} color={colors.primary} strokeWidth={2.5} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 13, color: "#166534", fontWeight: "600", lineHeight: 20, paddingTop: 5 }}>{text}</Text>
                </View>
              ))}
            </View>

            <Pressable
              onPress={() => router.replace("/auth/login")}
              style={({ pressed }) => ({ marginTop: 32, opacity: pressed ? 0.8 : 1 })}
            >
              <View style={[{ borderRadius: 20, paddingVertical: 18, alignItems: "center", backgroundColor: colors.primary }, shadowGreen]}>
                <Text style={{ fontSize: 16, fontWeight: "800", color: "#fff", letterSpacing: 0.3 }}>Log In Now</Text>
              </View>
            </Pressable>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
