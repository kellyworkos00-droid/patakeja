import "@/global.css";
import { useEffect } from "react";
import { Stack, router, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Handle error
    }
  },
};

// Handles auth-based redirects reactively — fixes race condition
// between Clerk setActive and Expo Router navigation.
function AuthGuard() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (!isLoaded) return;
    const inTabs = segments[0] === "tabs";
    const currentTab = segments[1];
    const authRoute = segments[0] === "auth";
    const onboardingRoute = segments[0] === "onboarding";

    // All tabs are accessible — auth is enforced at the index/onboarding level.
    const publicTabs = new Set(["home", "explore", "chat", "profile", "post", "bookings"]);
    const inProtectedTab = inTabs && !publicTabs.has(currentTab || "");

    if (isSignedIn && (authRoute || onboardingRoute)) {
      router.replace("/tabs/home");
    } else if (!isSignedIn && inProtectedTab) {
      router.replace("/auth/login");
    }
  }, [isSignedIn, isLoaded, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || ""}
      tokenCache={tokenCache}
    >
      <>
        <StatusBar style="dark" />
        <AuthGuard />
        <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/signup" />
        <Stack.Screen name="auth/forgot-password" />
        <Stack.Screen name="auth/help" />
        <Stack.Screen name="tabs" />
        <Stack.Screen name="listing/[id]" />
        <Stack.Screen name="listing/post" />
        <Stack.Screen name="chat/[id]" />
        <Stack.Screen name="bookings/create" />
        <Stack.Screen name="bookings/confirmation" />
        <Stack.Screen name="payments/payment" />
        <Stack.Screen name="payments/confirmation" />
        <Stack.Screen name="payments/escrow-status" />
        <Stack.Screen name="settings/index" />
        <Stack.Screen name="settings/edit-profile" />
        <Stack.Screen name="settings/verification" />
        <Stack.Screen name="safety/report" />
        <Stack.Screen name="search" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="notifications" />
      </Stack>
      </>
    </ClerkProvider>
  );
}
