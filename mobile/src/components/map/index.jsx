import { ExpoLeaflet } from "expo-leaflet";
import { Flex, IconButton } from "native-base";
import { useEffect, useReducer } from "react";
import { ActivityIndicator, Alert } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useUserLocation } from "../../store/location/provider";
import { logger } from "../../utils/logger";
import { mapConfig } from "./config";

function mapReducer(state, action) {
  logger.info(`[MAP] action of type ${action.type} fired`);

  switch (action.type) {
    case "TOGGLE_QUESTS": {
      const showQuests = !state.showQuests;
      const quests = showQuests ? action.payload : [];

      return {
        ...state,
        showQuests,
        quests,
      };
    }
    case "TOGGLE_DISTRICTS": {
      const showDistricts = !state.showDistricts;
      const districts = showDistricts ? action.payload : [];

      return {
        ...state,
        showDistricts,
        districts,
      };
    }
    default:
      return state;
  }
}

export default function LeafletMap({ polygons, quests }) {
  const [state, dispatch] = useReducer(mapReducer, {
    showDistricts: false,
    showQuests: false,
    districts: [],
    quests: [],
  });

  const {
    state: { position, zoom, markers },
    actions: {
      onMoveEnd,
      getUserPosition,
      addQuestsMarkers,
      removeQuestsMarkers,
    },
  } = useUserLocation();

  useEffect(() => {
    state.showQuests ? addQuestsMarkers(quests.markers) : removeQuestsMarkers();
  }, [state.showQuests]);

  function processLeafletEvent(event) {
    logger.info(`[LEAFLET] action of type ${event.tag} fired`);

    switch (event.tag) {
      case "onMapMarkerClicked":
        if (String(event.mapMarkerId).includes("@")) {
          Alert.alert("this is you", "keep exploring the map");
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

  return (
    <>
      <Flex flex={1} minH="100%">
        <ExpoLeaflet
          loadingIndicator={() => <ActivityIndicator />}
          mapCenterPosition={position}
          onMessage={processLeafletEvent}
          zoom={zoom}
          mapMarkers={markers}
          mapShapes={
            state.showDistricts || state.showQuests
              ? [...state.quests, ...state.districts]
              : []
          }
          {...mapConfig}
        />
      </Flex>
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
          <Icon
            name="map"
            size={25}
            color={state.showDistricts ? "#0047AB" : "#8c92ac"}
          />
        }
      />
      <IconButton
        onPress={() =>
          dispatch({
            type: "TOGGLE_QUESTS",
            payload: quests.shapes,
          })
        }
        position="absolute"
        right="3"
        top="32"
        mt={3}
        rounded="full"
        icon={
          <Icon
            name="file"
            size={25}
            color={state.showQuests ? "#0047AB" : "#8c92ac"}
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
