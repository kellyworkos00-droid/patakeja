import { Pressable, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { Bed, Home, MessageCircle, Plus, Search, UserRound } from "lucide-react-native";
import { colors } from "@/constants/colors";

type FloatingTabBarProps = {
  state: any;
  descriptors: any;
  navigation: any;
};

const icons = {
  home: Home,
  explore: Search,
  post: Plus,
  chat: MessageCircle,
  profile: UserRound,
};

const tabShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.18,
  shadowRadius: 24,
  elevation: 12,
};

export function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const visibleRoutes = state.routes.filter((route: any) => descriptors[route.key]?.options?.href !== null);

  return (
    <View
      style={[
        {
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          borderRadius: 28,
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.6)",
        },
        tabShadow,
      ]}
    >
      <BlurView intensity={70} tint="light" style={{ paddingHorizontal: 8, paddingTop: 10, paddingBottom: 10 }}>
        {/* glass tint overlay */}
        <View
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.55)",
          }}
          pointerEvents="none"
        />

        <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
          {visibleRoutes.map((route: any) => {
            const routeIndex = state.routes.findIndex((item: any) => item.key === route.key);
            const focused = state.index === routeIndex;
            const { options } = descriptors[route.key];
            const label = options.title ?? route.name;
            const Icon = icons[route.name as keyof typeof icons] ?? Bed;
            const isPost = route.name === "post";

            const onPress = () => {
              if (isPost) {
                router.push("/listing/post");
                return;
              }
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={focused ? { selected: true } : {}}
                onPress={onPress}
                style={{
                  flex: isPost ? undefined : 1,
                  width: isPost ? 60 : undefined,
                  alignItems: "center",
                  paddingVertical: 4,
                  marginTop: isPost ? -28 : 0,
                }}
              >
                {isPost ? (
                  <View
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 27,
                      backgroundColor: colors.primary,
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 2,
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.4,
                      shadowRadius: 8,
                      elevation: 6,
                    }}
                  >
                    <Icon color="#fff" size={26} strokeWidth={2.5} />
                  </View>
                ) : (
                  <View
                    style={{
                      width: 38,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: focused ? colors.primary + "1A" : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 3,
                    }}
                  >
                    <Icon
                      color={focused ? colors.primary : "rgba(15,23,42,0.45)"}
                      size={22}
                      fill={focused ? colors.primary + "30" : "transparent"}
                      strokeWidth={focused ? 2.5 : 2}
                    />
                  </View>
                )}
                {!isPost && (
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: focused ? "700" : "500",
                      color: focused ? colors.primary : "rgba(15,23,42,0.45)",
                      letterSpacing: 0.2,
                    }}
                  >
                    {label}
                  </Text>
                )}
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}
