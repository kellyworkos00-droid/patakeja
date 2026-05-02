import { Pressable, Text, View } from "react-native";
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
  shadowColor: colors.navy,
  shadowOffset: { width: 0, height: 16 },
  shadowOpacity: 0.12,
  shadowRadius: 28,
  elevation: 8,
};

export function FloatingTabBar({ state, descriptors, navigation }: FloatingTabBarProps) {
  const visibleRoutes = state.routes.filter((route: any) => descriptors[route.key]?.options?.href !== null);

  return (
    <View className="absolute bottom-5 left-5 right-5 rounded-[32px] bg-white px-4 pb-3 pt-4" style={tabShadow}>
      <View className="flex-row items-end justify-between">
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
              className={`${isPost ? "-mt-9 w-16" : "min-w-[58px]"} items-center rounded-full px-1 py-1`}
            >
              {isPost ? (
                <View className="mb-1 h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <Icon color={colors.card} size={36} strokeWidth={2.4} />
                </View>
              ) : (
                <Icon color={focused ? colors.primary : colors.navy} size={27} fill={focused ? colors.primary : "transparent"} strokeWidth={focused ? 2.7 : 2.2} />
              )}
              <Text className={`text-sm font-semibold ${focused ? "text-primary" : "text-navy/55"}`}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
