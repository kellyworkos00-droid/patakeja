import { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { LocateFixed, Map } from "lucide-react-native";
import { colors } from "@/constants/colors";

type MapPreviewCardProps = {
  onOpenMap?: () => void;
};

const shadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.11,
  shadowRadius: 18,
  elevation: 8,
};

const miniShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 12,
  elevation: 5,
};

function Pin({ count, left, top, pulse }: { count: string; left: number; top: number; pulse: Animated.Value }) {
  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1.35],
  });

  const opacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.26, 0],
  });

  return (
    <View style={{ position: "absolute", left, top }}>
      <Animated.View
        style={{
          position: "absolute",
          left: -8,
          top: -8,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: colors.primary,
          opacity,
          transform: [{ scale }],
        }}
      />
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>{count}</Text>
      </View>
    </View>
  );
}

export function MapPreviewCard({ onOpenMap }: MapPreviewCardProps) {
  const pulseA = useRef(new Animated.Value(0)).current;
  const pulseB = useRef(new Animated.Value(0)).current;
  const pulseC = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createPulse = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 1550,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );

    const loopA = createPulse(pulseA, 0);
    const loopB = createPulse(pulseB, 330);
    const loopC = createPulse(pulseC, 660);

    loopA.start();
    loopB.start();
    loopC.start();

    return () => {
      loopA.stop();
      loopB.stop();
      loopC.stop();
    };
  }, [pulseA, pulseB, pulseC]);

  return (
    <View
      style={[
        {
          marginHorizontal: 20,
          height: 190,
          borderRadius: 24,
          overflow: "hidden",
          backgroundColor: "#E8EEF4",
        },
        shadow,
      ]}
    >
      <View style={{ position: "absolute", width: 260, height: 260, borderRadius: 130, backgroundColor: "#DCE7F1", left: -70, top: -140 }} />
      <View style={{ position: "absolute", width: 200, height: 200, borderRadius: 100, backgroundColor: "#EAF1F8", right: -30, top: -90 }} />
      <View style={{ position: "absolute", left: 20, right: 20, top: 40, height: 2, backgroundColor: "#D5E2EE", transform: [{ rotate: "-12deg" }] }} />
      <View style={{ position: "absolute", left: 60, right: 10, top: 82, height: 2, backgroundColor: "#D5E2EE", transform: [{ rotate: "8deg" }] }} />
      <View style={{ position: "absolute", left: 30, right: 50, top: 125, height: 2, backgroundColor: "#D5E2EE", transform: [{ rotate: "-6deg" }] }} />

      <Pin count="12" left={14} top={84} pulse={pulseA} />
      <Pin count="28" left={132} top={72} pulse={pulseB} />
      <Pin count="15" left={248} top={92} pulse={pulseC} />

      <Pressable onPress={onOpenMap} style={{ position: "absolute", left: 0, right: 0, bottom: 14, alignItems: "center" }}>
        <View style={[{ flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#FFFFFF", paddingHorizontal: 18, paddingVertical: 11, borderRadius: 22 }, miniShadow]}>
          <Map color={colors.navy} size={18} strokeWidth={2.2} />
          <Text style={{ color: colors.navy, fontSize: 16, fontWeight: "800" }}>View on Map</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onOpenMap}
        style={[
          {
            position: "absolute",
            right: 12,
            bottom: 14,
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
          },
          miniShadow,
        ]}
      >
        <LocateFixed color={colors.navy} size={19} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}
