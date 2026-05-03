import { Pressable, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { LocateFixed, Map } from "lucide-react-native";
import { colors } from "@/constants/colors";

type MapPreviewCardProps = {
  onOpenMap?: () => void;
};

const INITIAL_REGION = {
  latitude: -1.2836,
  longitude: 36.8330,
  latitudeDelta: 0.11,
  longitudeDelta: 0.11,
};

const PINS = [
  { id: "1", count: "12", latitude: -1.2636, longitude: 36.8070 },
  { id: "2", count: "28", latitude: -1.2867, longitude: 36.8219 },
  { id: "3", count: "15", latitude: -1.3017, longitude: 36.8600 },
];

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

export function MapPreviewCard({ onOpenMap }: MapPreviewCardProps) {
  return (
    <View
      style={[
        {
          marginHorizontal: 20,
          height: 190,
          borderRadius: 24,
          overflow: "hidden",
        },
        shadow,
      ]}
    >
      <MapView
        style={{ flex: 1 }}
        initialRegion={INITIAL_REGION}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
      >
        {PINS.map((pin) => (
          <Marker
            key={pin.id}
            coordinate={{ latitude: pin.latitude, longitude: pin.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary,
                alignItems: "center",
                justifyContent: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>{pin.count}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <Pressable onPress={onOpenMap} style={{ position: "absolute", left: 0, right: 0, bottom: 14, alignItems: "center" }}>
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 18,
              paddingVertical: 11,
              borderRadius: 22,
            },
            miniShadow,
          ]}
        >
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
