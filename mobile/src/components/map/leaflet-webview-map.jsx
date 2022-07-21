import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Flex, IconButton } from "native-base";
import { useEffect, useReducer } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { LeafletView } from "react-native-leaflet-view";
import { useUserLocation } from "../../store/location/provider";
import { logger } from "../../utils/logger";
import { mapConfig } from "./utils/config";
import { mapInitialState, mapReducer } from "./utils/reducer";

export default function LeafletWebviewMap({ polygons, quests }) {
  const [state, dispatch] = useReducer(mapReducer, mapInitialState);

  const {
    state: { zoom, markers, ownMarker, position },
    actions: { getUserPosition, addQuestsMarkers, removeQuestsMarkers },
  } = useUserLocation();

  useEffect(() => {
    if (state.showQuests) {
      addQuestsMarkers(quests.markers);
      dispatch({
        type: "UPDATE_SHOW_QUESTS",
        payload: { shapes: quests.shapes, toggle: false },
      });
    }
  }, [quests.markers]);

  useEffect(() => {
    state.showQuests ? addQuestsMarkers(quests.markers) : removeQuestsMarkers();
  }, [state.showQuests]);

  function processLeafletMessage(message) {
    logger.info(`[LEAFLET] action of type ${message.event} fired`);

    switch (message.event) {
      case "onMapMarkerClicked":
        if (String(message.payload.mapMarkerID).includes("@")) {
          Alert.alert("this is you", "keep exploring the map");
        }
        break;
      case "onMoveEnd":
        break;
      case "onMoveStart":
        // maybe delay when getCurrentPosition is called
        break;
      case "onResize" | "onMove" | "onUnload":
        break;
      case "onViewReset":
        getUserPosition();
        break;
      case "onZoomEnd":
        break;
      case "onZoomLevelsChange":
        break;
      case "onZoomStart":
        break;
      case "onZoom":
        break;
      case "onMapClicked":
        break;
      default:
        break;
    }
  }

  console.log({ quests });

  return (
    <>
      <Flex flex={1} minH="100%">
        <LeafletView
          doDebug={true}
          onError={(e) => logger.error(e)}
          ownPositionMarker={ownMarker}
          mapShapes={state.combined}
          mapLayers={mapConfig.mapLayers}
          mapMarkers={markers}
          renderLoading={() => <ActivityIndicator />}
          mapCenterPosition={position}
          zoom={zoom}
          onMessageReceived={processLeafletMessage}
        />
      </Flex>
      {polygons.length && (
        <IconButton
          onPress={() =>
            dispatch({
              type: "TOGGLE_DISTRICTS",
              payload: polygons,
            })
          }
          position="absolute"
          right="3"
          top="24"
          rounded="full"
          icon={
            <FontAwesome
              name="map"
              size={25}
              color={state.showDistricts ? "#0047AB" : "#8c92ac"}
            />
          }
        />
      )}
      {quests.shapes.length && quests.markers.length && (
        <IconButton
          onPress={() =>
            dispatch({
              type: "UPDATE_SHOW_QUESTS",
              payload: { shapes: quests.shapes, toggle: true },
            })
          }
          position="absolute"
          right="3"
          top="32"
          mt={3}
          rounded="full"
          icon={
            <FontAwesome
              name="file"
              size={25}
              color={state.showQuests ? "#0047AB" : "#8c92ac"}
            />
          }
        />
      )}
      <IconButton
        onPress={() => getUserPosition()}
        position="absolute"
        right="3"
        bottom="3"
        rounded="full"
        icon={<FontAwesome name="compass" size={35} color="#0047AB" />}
      />
    </>
  );
}