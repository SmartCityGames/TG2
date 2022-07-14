import { ExpoLeaflet } from "expo-leaflet";
import { Center, IconButton } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useUserLocation } from "../../store/location/provider";
import { logger } from "../../utils/logger";
import { mapConfig } from "./config";
import { generateColours } from "../../utils/generate-colours";

export default function LeafletMap() {
  const {
    state: { position, zoom, marker: userMarker, loading, geojson },
    actions: { onMoveEnd, getUserPosition },
  } = useUserLocation();
  const [shapes, setShapes] = useState([]);
  const [showShapes, setShowShapes] = useState(false);

  useEffect(() => {
    if (!geojson) return;

    const parsedShapes = geojson.features.map((f, i) => ({
      id: i,
      shapeType: "polygon",
      positions: f.geometry.coordinates[0].map(([lng, lat]) => ({
        lng,
        lat,
      })),
    }));

    const colors = generateColours({
      quantity: parsedShapes.length,
      shuffle: true,
      offset: 45,
    });

    setShapes(
      parsedShapes.map((shape) => ({ ...shape, color: colors[shape.id] }))
    );
  }, [geojson]);

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
          mapMarkers={[userMarker]}
          mapShapes={showShapes ? shapes : []}
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
