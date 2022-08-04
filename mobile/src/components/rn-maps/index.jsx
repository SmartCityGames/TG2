import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { IconButton } from "native-base";
import { useEffect, useMemo, useReducer, useRef } from "react";
import { Alert } from "react-native";
import MapView, {
  Circle,
  Geojson,
  MAP_TYPES,
  Marker,
  PROVIDER_DEFAULT,
  UrlTile,
} from "react-native-maps";
import { useUserLocation } from "../../store/location/provider";
import { mapInitialState, mapReducer } from "./utils/reducer";

export default function RnMaps({ polygons, quests }) {
  const mapRef = useRef(null);
  const [state, dispatch] = useReducer(mapReducer, mapInitialState);
  const { navigate } = useNavigation();
  const {
    state: { region },
    actions: { removeQuestsMarkers, addQuestsMarkers, getUserPosition },
  } = useUserLocation();

  useEffect(() => {
    if (!state.showQuests) return;

    addQuestsMarkers(quests.markers);
    dispatch({
      type: "UPDATE_SHOW_QUESTS",
      payload: { shapes: quests.shapes, toggle: false },
    });
  }, [quests.markers]);

  useEffect(() => {
    if (!state.showQuests) {
      removeQuestsMarkers();
      return;
    }

    addQuestsMarkers(quests.markers);
  }, [state.showQuests]);

  const questsInfo = useMemo(
    () => ({
      markers: quests.markers.map((m) => (
        <Marker
          key={`marker_${m.position.lat}_${m.position.lng}`}
          identifier={m.id}
          tracksViewChanges={false}
          tracksInfoWindowChanges={false}
          title={m.name}
          description={m.description}
          coordinate={{
            latitude: m.position.lat,
            longitude: m.position.lng,
          }}
          onPress={() => {
            Alert.alert(`this is ${m.id}`);
          }}
        />
      )),
      shapes: quests.shapes.map((s) => (
        <Circle
          key={`circle_${s.center.lat}_${s.center.lng}`}
          center={{
            latitude: s.center.lat,
            longitude: s.center.lng,
          }}
          radius={s.radius}
          fillColor={`${s.color}99`}
        />
      )),
    }),
    [quests]
  );

  const polygonsShapes = useMemo(
    () =>
      polygons.map((p) => (
        <Geojson
          key={p.id}
          fillColor={p.color}
          title={p.features[0].properties.NM_SUBDIST}
          geojson={p}
          tappable={true}
          strokeWidth={2}
          onPress={() =>
            navigate("Indicators", {
              district: p.features[0].properties.NM_SUBDIST,
            })
          }
        />
      )),
    [polygons]
  );

  return (
    <>
      <MapView
        ref={mapRef}
        userLocationPriority="high"
        region={region}
        style={{ flex: 1 }}
        provider={PROVIDER_DEFAULT}
        mapType={MAP_TYPES.STANDARD}
        showsUserLocation
        rotateEnabled={false}
        showsCompass={false}
        showsMyLocationButton={false}
        showsScale={false}
        showsTraffic={false}
        maxZoomLevel={17}
        minZoomLevel={3}
        showsBuildings={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsPointsOfInterest={false}
        zoomControlEnabled={false}
      >
        <UrlTile urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {state.showQuests && questsInfo.markers}
        {state.showQuests && questsInfo.shapes}
        {state.showDistricts && polygonsShapes}
      </MapView>
      {!!polygons?.length && (
        <IconButton
          onPress={() =>
            dispatch({
              type: "TOGGLE_DISTRICTS",
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
      {!!quests?.shapes?.length && !!quests?.markers?.length && (
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
