import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Bed, CalendarDays, Home, MessageCircle, Plus, Search, UserRound } from "lucide-react-native";
import { chats } from "@/data/mockChats";
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
  bookings: CalendarDays,
};

const chatUnread = chats.reduce((s, c) => s + c.unread, 0);

const POST_ROUTE = "post";
const CHAT_ROUTE = "chat";
const TAB_PRESS_EVENT = "tabPress";

const tabShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 14 },
  shadowOpacity: 0.14,
  shadowRadius: 22,
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
          borderRadius: 30,
          backgroundColor: "rgba(255,255,255,0.96)",
          borderWidth: 1,
          borderColor: "rgba(226,232,240,0.9)",
          paddingHorizontal: 10,
          paddingTop: 10,
          paddingBottom: 12,
        },
        tabShadow,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
        {visibleRoutes.map((route: any) => {
          const routeIndex = state.routes.findIndex((item: any) => item.key === route.key);
          const focused = state.index === routeIndex;
          const { options } = descriptors[route.key];
          const label = options.title ?? route.name;
          const Icon = icons[route.name as keyof typeof icons] ?? Bed;
          const isPost = route.name === POST_ROUTE;
          const showChatBadge = !isPost && route.name === CHAT_ROUTE && chatUnread > 0;

          const onPress = () => {
            if (isPost) {
              router.push("/listing/post");
              return;
            }
            const event = navigation.emit({
              type: TAB_PRESS_EVENT,
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
                width: isPost ? 62 : undefined,
                alignItems: "center",
                paddingVertical: 4,
                marginTop: isPost ? -30 : 0,
              }}
            >
              {isPost ? (
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: colors.primary,
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 4,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 7 },
                    shadowOpacity: 0.28,
                    shadowRadius: 12,
                    elevation: 8,
                  }}
                >
                  <Icon color="#fff" size={26} strokeWidth={2.5} />
                </View>
              ) : (
                <View
                  style={{
                    minWidth: 44,
                    height: 34,
                    borderRadius: 17,
                    paddingHorizontal: 10,
                    backgroundColor: focused ? "#E8F6EF" : "transparent",
                    borderWidth: focused ? 1 : 0,
                    borderColor: focused ? "#BFE7D1" : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 4,
                  }}
                >
                  <Icon
                    color={focused ? colors.primary : "rgba(15,23,42,0.52)"}
                    size={21}
                    fill={focused ? colors.primary + "22" : "transparent"}
                    strokeWidth={focused ? 2.5 : 2}
                  />
                  {showChatBadge ? (
                    <View style={{ position: "absolute", top: 2, right: 2, minWidth: 16, height: 16, borderRadius: 8, paddingHorizontal: 4, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", fontSize: 9.5, fontWeight: "800" }}>{chatUnread}</Text>
                    </View>
                  ) : null}
                </View>
              )}
              {!isPost && (
                <Text
                  style={{
                    fontSize: 10,
                    fontWeight: focused ? "800" : "600",
                    color: focused ? colors.navy : "rgba(15,23,42,0.5)",
                    letterSpacing: 0.15,
                  }}
                >
                  {label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
