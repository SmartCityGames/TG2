import { ExpoLeaflet } from "expo-leaflet";
import { IconButton } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useUserLocation } from "../../store/location/provider";
import { logger } from "../../utils/logger";
import { mapConfig } from "./config";

export default function LeafletMap({ polygons, quests }) {
  const {
    state: { position, zoom, markers },
    actions: {
      onMoveEnd,
      getUserPosition,
      addQuestsMarkers,
      removeQuestsMarkers,
    },
  } = useUserLocation();

  const [showShapes, setShowShapes] = useState(false);
  const [showQuests, setShowQuests] = useState(false);

  useEffect(() => {
    showQuests ? addQuestsMarkers(quests.markers) : removeQuestsMarkers();
  }, [showQuests]);

  function processLeafletEvent(event) {
    logger.info(`[LEAFLET] action of type ${event.tag} fired`);

    switch (event.tag) {
      case "onMapMarkerClicked":
        if (event.mapMarkerId.includes("quest")) {
          const questId = event.mapMarkerId.split(":")[1];

          Alert.alert(
            `${availableQuests[questId].name}`,
            `${availableQuests[questId].description}`
          );
        } else {
          Alert.alert(
            `Map Marker Touched, ID: ${event.mapMarkerId || "unknown"}`
          );
        }
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

  function getShapes() {
    if (showShapes && showQuests) return [...polygons, ...quests.shapes];
    if (showShapes && !showQuests) return polygons;
    if (!showShapes && showQuests) return quests.shapes;

    return [];
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
          mapShapes={getShapes()}
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
        onPress={() => setShowQuests((v) => !v)}
        position="absolute"
        right="3"
        top="32"
        mt={3}
        rounded="full"
        icon={
          <Icon
            name="file"
            size={25}
            color={showQuests ? "#0047AB" : "#8c92ac"}
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
