import { ExpoLeaflet } from "expo-leaflet";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { useUserLocation } from "../../store/location/provider";
import { mapConfig } from "./config";
import mapStyles from "./style";

export default function LeafletMap() {
  const {
    state: { position, zoom, marker: userMarker },
    actions: { onMoveEnd, getUserPosition },
  } = useUserLocation();

  function processLeafletEvent(event) {
    console.log("incoming event:", JSON.stringify(event, null, 2));

    switch (event.tag) {
      case "onMapMarkerClicked":
        Alert.alert(
          `Map Marker Touched, ID: ${event.mapMarkerId || "unknown"}`
        );
        break;
      case "onMapClicked":
        Alert.alert(
          `Map Touched at:`,
          `${event.location.lat}, ${event.location.lng}`
        );
        break;
      case "onMoveEnd":
        onMoveEnd({
          position: event.mapCenter,
          zoom: Math.min(event.zoom, mapConfig.maxZoom),
        });
        break;
      default:
        if (["onMove"].includes(event.tag)) {
          return;
        }
    }
  }

  return (
    <>
      <ExpoLeaflet
        loadingIndicator={() => <ActivityIndicator />}
        mapCenterPosition={position}
        onMessage={processLeafletEvent}
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
        onPress={() => getUserPosition()}
      >
        <Text style={{ color: "white" }}>Me</Text>
      </Pressable>
    </>
  );
}
