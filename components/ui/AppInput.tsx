import { ReactNode } from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

type AppInputProps = TextInputProps & {
  label: string;
  icon?: ReactNode;
  right?: ReactNode;
};

export function AppInput({ label, icon, right, ...props }: AppInputProps) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-semibold text-navy/70">{label}</Text>
      <View className="h-14 flex-row items-center gap-3 rounded-2xl border border-navy/10 bg-white px-4">
        {icon}
        <TextInput
          className="flex-1 text-base text-navy"
          placeholderTextColor="rgba(15, 23, 42, 0.45)"
          {...props}
        />
        {right}
      </View>
    </View>
  );
}
