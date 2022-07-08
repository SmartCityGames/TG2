import { ExpoLeaflet } from "expo-leaflet";
import { ActivityIndicator, Alert } from "react-native";
import { useUserLocation } from "../../store/location/provider";
import { mapConfig } from "./config";
import { Box, Button, Center, Flex, Text } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";

export default function LeafletMap() {
  const {
    state: { position, zoom, marker: userMarker },
    actions: { onMoveEnd, getUserPosition },
  } = useUserLocation();

  function processLeafletEvent(event) {
    console.log(`[LEAFLET] action of type ${event.tag} fired`);

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
    <Flex flex={1}>
      <ExpoLeaflet
        loadingIndicator={() => <ActivityIndicator />}
        mapCenterPosition={position}
        onMessage={processLeafletEvent}
        zoom={zoom}
        mapMarkers={[userMarker]}
        {...mapConfig}
      />
      <Button
        onPress={() => getUserPosition()}
        position="absolute"
        right="3"
        bottom="3"
        variant="outline"
        rounded="full"
      >
        <Icon name="compass" size={30} />
      </Button>
    </Flex>
  );
}
