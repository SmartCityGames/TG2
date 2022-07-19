import { ExpoLeaflet } from "expo-leaflet";
import { Center, IconButton } from "native-base";
import { useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useUserLocation } from "../../store/location/provider";
import { logger } from "../../utils/logger";
import { mapConfig } from "./config";

export default function LeafletMap({ polygons }) {
  const {
    state: { position, zoom, markers, loading },
    actions: { onMoveEnd, getUserPosition },
  } = useUserLocation();
  const [showShapes, setShowShapes] = useState(false);

  function processLeafletEvent(event) {
    logger.info(`[LEAFLET] action of type ${event.tag} fired`);

    switch (event.tag) {
      case "onMapMarkerClicked":
        Alert.alert(
          `Map Marker Touched, ID: ${event.mapMarkerId || "unknown"}`
        );
        break;
      case "onMoveEnd":
        onMoveEnd({
          position: event.mapCenter,
          zoom: Math.min(event.zoom, mapConfig.maxZoom),
        });
        break;
      default:
        if (["onMove", "onMapClicked"].includes(event.tag)) {
          return;
        }
    }
  }

  if (loading) {
    return (
      <Center flex={1}>
        <ActivityIndicator />
      </Center>
    );
  }

  return (
    <>
      <View style={{ flex: 1, minHeight: "100%" }}>
        <ExpoLeaflet
          loadingIndicator={() => <ActivityIndicator />}
          mapCenterPosition={position}
          onMessage={processLeafletEvent}
          zoom={zoom}
          mapMarkers={markers}
          mapShapes={showShapes ? polygons : []}
          {...mapConfig}
        />
      </View>
      <IconButton
        onPress={() => setShowShapes((v) => !v)}
        position="absolute"
        right="3"
        top="24"
        rounded="full"
        icon={
          <Icon
            name="map"
            size={25}
            color={showShapes ? "#0047AB" : "#8c92ac"}
          />
        }
      />
      <IconButton
        onPress={() => getUserPosition()}
        position="absolute"
        right="3"
        bottom="3"
        rounded="full"
        icon={<Icon name="compass" size={35} color="#0047AB" />}
      />
    </>
  );
}
