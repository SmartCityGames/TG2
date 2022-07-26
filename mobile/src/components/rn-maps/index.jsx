import FontAwesome from "@expo/vector-icons/FontAwesome";
import { IconButton } from "native-base";
import { useEffect, useReducer } from "react";
import { Alert } from "react-native";
import MapView, {
  Circle,
  Geojson,
  MAP_TYPES,
  Marker,
  UrlTile,
} from "react-native-maps";
import { useUserLocation } from "../../store/location/provider";
import { mapInitialState, mapReducer } from "../map/utils/reducer";

export default function RnMaps({ polygons, quests }) {
  const [state, dispatch] = useReducer(mapReducer, mapInitialState);

  const {
    state: { position },
    actions: { getUserPosition, removeQuestsMarkers, addQuestsMarkers },
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

  return (
    <>
      <MapView
        userLocationPriority="high"
        userLocationCalloutEnabled
        region={{
          latitude: position?.lat,
          longitude: position?.lng,
          latitudeDelta: 0.014,
          longitudeDelta: 0.014,
        }}
        style={{ flex: 1 }}
        provider={null}
        mapType={MAP_TYPES.STANDARD}
        showsUserLocation
        rotateEnabled={false}
        showsCompass={false}
        showsMyLocationButton={false}
        showsScale={false}
        showsTraffic={false}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          tileSize={256}
          tileCacheMaxAge={1000 * 60 * 60 * 24 * 7}
        />
        {state.showQuests
          ? quests.markers.map((m) => (
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
                  Alert.alert(`this is ${m.id} of type: ${m.type}`);
                }}
              />
            ))
          : null}
        {state.showQuests
          ? quests.shapes.map((m) => (
              <Circle
                key={`circle_${m.center.lat}_${m.center.lng}`}
                center={{
                  latitude: m.center.lat,
                  longitude: m.center.lng,
                }}
                radius={m.radius}
                fillColor={`${m.color}99`}
              />
            ))
          : null}
        {state.showDistricts
          ? state.districts.map((p) => (
              <Geojson
                key={p.id}
                fillColor={p.color}
                title={p.features[0].properties.name}
                geojson={p}
                tappable={false}
                strokeWidth={2}
              />
            ))
          : null}
      </MapView>
      {polygons?.length ? (
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
      ) : null}
      {quests.shapes.length && quests.markers.length ? (
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
      ) : null}
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
