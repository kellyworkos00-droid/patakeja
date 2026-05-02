import { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenContainerProps = {
  children: ReactNode;
  scroll?: boolean;
  padded?: boolean;
  footer?: ReactNode;
  contentClassName?: string;
};

export function ScreenContainer({
  children,
  scroll = true,
  padded = true,
  footer,
  contentClassName = "",
}: ScreenContainerProps) {
  const paddingClass = padded ? "px-5" : "";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "left", "right"]}>
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName={`${paddingClass} pb-32 ${contentClassName}`}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className={`flex-1 ${paddingClass} ${contentClassName}`}>{children}</View>
      )}
      {footer}
    </SafeAreaView>
  );
}
