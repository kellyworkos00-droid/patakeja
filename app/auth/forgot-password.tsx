import { useState } from "react";
import { Alert, Image, Text, View } from "react-native";
import { router } from "expo-router";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react-native";
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
  const [loading, setLoading] = useState(false);

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
          { text: "Continue", onPress: () => router.replace("/tabs/home") },
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
                label="Verification code"
                placeholder="Enter code"
                value={code}
                onChangeText={setCode}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
                icon={<ShieldCheck color={colors.navy} size={20} />}
              />

              <AppInput
                label="New password"
                placeholder="At least 8 characters"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
                icon={<LockKeyhole color={colors.navy} size={20} />}
              />

              <AppInput
                label="Confirm new password"
                placeholder="Re-enter new password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
                autoCapitalize="none"
                autoCorrect={false}
                icon={<LockKeyhole color={colors.navy} size={20} />}
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
