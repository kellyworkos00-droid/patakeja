import { Tabs } from "expo-router";
import { FloatingTabBar } from "@/components/navigation/FloatingTabBar";

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <FloatingTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Explore" }} />
      <Tabs.Screen name="post" options={{ title: "Post" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      <Tabs.Screen name="bookings" options={{ title: "Bookings", href: null }} />
    </Tabs>
  );
}
