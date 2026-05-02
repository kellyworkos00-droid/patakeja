import { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Image, Pressable, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import { Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react-native";
import { useSignIn } from "@clerk/clerk-expo";
import { images } from "@/constants/assets";
import { colors } from "@/constants/colors";
import { AppButton } from "@/components/ui/AppButton";
import { AppInput } from "@/components/ui/AppInput";
import { FloatingHeader } from "@/components/layout/FloatingHeader";
import { ScreenContainer } from "@/components/layout/ScreenContainer";

export default function ForgotPasswordScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const codeInputRef = useRef<TextInput>(null);
  const newPasswordInputRef = useRef<TextInput>(null);
  const confirmPasswordInputRef = useRef<TextInput>(null);

  const goBack = () => {
    if (step === "reset") {
      setStep("request");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (step === "reset") {
        goBack();
        return true; // consume the event
      }
      return false;
    });
    return () => sub.remove();
  }, [step]);

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

  const sendResetCode = async () => {
    if (!isLoaded) return;

    const normalizedEmail = email.trim().toLowerCase();
    if (!validateEmail(normalizedEmail)) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: normalizedEmail,
      });

      setStep("reset");
      setTimeout(() => codeInputRef.current?.focus(), 120);
      Alert.alert("Code sent", "We sent a verification code to your email.");
    } catch (err: any) {
      Alert.alert("Reset failed", err.errors?.[0]?.message || "Could not send reset code.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    if (!isLoaded) return;

    if (!code.trim()) {
      Alert.alert("Missing code", "Enter the verification code sent to your email.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Weak password", "Your new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please confirm the same new password.");
      return;
    }

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
          { text: "Continue", onPress: () => router.replace("/auth/login") },
        ]);
        return;
      }

      Alert.alert("Additional verification needed", "Please complete any additional verification steps.");
    } catch (err: any) {
      Alert.alert("Reset failed", err.errors?.[0]?.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer contentClassName="pt-2">
      <FloatingHeader
        title="Forgot password"
        subtitle={step === "request" ? "We will send reset instructions to your email" : "Enter your code and set a new password"}
        onBack={goBack}
      />
      <Image source={images.forgotDirection} className="mb-5 h-52 w-full rounded-[32px]" resizeMode="cover" />
      <View className="rounded-[32px] bg-white p-5">
        {step === "request" ? (
          <>
            <Text className="text-2xl font-extrabold text-navy">Reset your password</Text>
            <Text className="mt-2 text-base leading-6 text-navy/65">Enter the email linked to your PataKeja account.</Text>
            <View className="mt-6">
              <AppInput
                label="Email address"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!loading}
                icon={<Mail color={colors.navy} size={20} />}
              />
            </View>
            <AppButton title="Send Reset Code" full loading={loading} onPress={sendResetCode} style={{ marginTop: 22 }} />
          </>
        ) : (
          <>
            <Text className="text-2xl font-extrabold text-navy">Create a new password</Text>
            <Text className="mt-2 text-base leading-6 text-navy/65">Use the code sent to {email.trim().toLowerCase()} and set your new password.</Text>

            <View className="mt-6 gap-4">
              <AppInput
                ref={codeInputRef}
                label="Verification code"
                placeholder="Enter 6-digit code"
                value={code}
                onChangeText={(value) => {
                  const sanitized = value.replace(/\D/g, "").slice(0, 6);
                  setCode(sanitized);
                  if (sanitized.length === 6) {
                    newPasswordInputRef.current?.focus();
                  }
                }}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                maxLength={6}
                returnKeyType="next"
                onSubmitEditing={() => newPasswordInputRef.current?.focus()}
                icon={<ShieldCheck color={colors.navy} size={20} />}
              />

              <AppInput
                ref={newPasswordInputRef}
                label="New password"
                placeholder="At least 8 characters"
                secureTextEntry={!showNewPassword}
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={128}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
                icon={<LockKeyhole color={colors.navy} size={20} />}
                right={
                  <Pressable onPress={() => setShowNewPassword((prev) => !prev)} hitSlop={10}>
                    {showNewPassword ? <EyeOff color={colors.navy} size={20} /> : <Eye color={colors.navy} size={20} />}
                  </Pressable>
                }
              />

              <AppInput
                ref={confirmPasswordInputRef}
                label="Confirm new password"
                placeholder="Re-enter new password"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={128}
                returnKeyType="done"
                onSubmitEditing={resetPassword}
                icon={<LockKeyhole color={colors.navy} size={20} />}
                right={
                  <Pressable onPress={() => setShowConfirmPassword((prev) => !prev)} hitSlop={10}>
                    {showConfirmPassword ? <EyeOff color={colors.navy} size={20} /> : <Eye color={colors.navy} size={20} />}
                  </Pressable>
                }
              />
            </View>

            <AppButton title="Reset Password" full loading={loading} onPress={resetPassword} style={{ marginTop: 22 }} />
            <AppButton
              title="Resend Code"
              variant="outline"
              full
              disabled={loading}
              onPress={sendResetCode}
              style={{ marginTop: 12 }}
            />
            <AppButton
              title="Use a different email"
              variant="ghost"
              full
              disabled={loading}
              onPress={() => {
                setStep("request");
                setCode("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              style={{ marginTop: 8 }}
            />
          </>
        )}
      </View>
    </ScreenContainer>
  );
}
