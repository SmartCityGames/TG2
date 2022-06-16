import { ExpoLeaflet } from "expo-leaflet";
import { ActivityIndicator, Button, Pressable, Text, View } from "react-native";
import { getUserPosition } from "../../store/location/actions";
import { useUserLocation } from "../../store/location/provider";
import { mapConfig } from "./config";
import { processLeafletEvent } from "./event-processor";
import mapStyles from "./style";

export default function LeafletMap() {
  const {
    state: { position, zoom, marker: userMarker },
    dispatch,
  } = useUserLocation();

  return (
    <View style={mapStyles.container}>
      <ExpoLeaflet
        loadingIndicator={() => <ActivityIndicator />}
        mapCenterPosition={position!}
        onMessage={(message) => processLeafletEvent(message, dispatch)}
        zoom={zoom}
        mapMarkers={[userMarker]}
        {...mapConfig}
      />
      <Pressable
        style={{
          position: "absolute",
          bottom: 5,
          right: 15,
          borderRadius: 50,
          backgroundColor: "#ff249f",
          padding: 16,
        }}
        onPress={() => getUserPosition(dispatch)}
      >
        <Text style={{ color: "white" }}>Me</Text>
      </Pressable>
    </View>
  );
}
