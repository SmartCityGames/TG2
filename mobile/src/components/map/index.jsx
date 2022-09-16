import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Accuracy, getCurrentPositionAsync } from "expo-location";
import { Flex, IconButton, Text } from "native-base";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import MapView from "react-native-map-clustering";
import {
  Circle,
  Geojson,
  MAP_TYPES,
  Marker,
  PROVIDER_DEFAULT,
  UrlTile,
} from "react-native-maps";
import { useIndicators } from "../../store/indicators/provider";
import { INDICATORS_LABELS } from "../../store/indicators/utils/indicators-labels";
import { renderSelectedIndicatorValue } from "../../store/indicators/utils/render-indicator-value";
import { initialRegion, useUserLocation } from "../../store/location/provider";
import { CenterLoading } from "../loading/center-loading";
import { hsl2rgb } from "./utils/hsl-2-rgb";
import IndicatorForm from "./utils/indicator-form";
import { mapInitialState, mapReducer } from "./utils/reducer";

export default function Map({ polygons, quests }) {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(undefined);

  const [state, dispatch] = useReducer(mapReducer, mapInitialState);

  const { navigate } = useNavigation();

  const {
    actions: { removeQuestsMarkers, addQuestsMarkers, getUserPosition },
  } = useUserLocation();

  const {
    state: { selectedIndicator },
  } = useIndicators();

  useEffect(() => {
    getCurrentPositionAsync({
      accuracy: Accuracy.Highest,
      maximumAge: 50,
    }).then((location) => {
      const { latitude, longitude } = location.coords;
      setLocation({ latitude, longitude });
    });
  }, []);

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
            navigate("Indicadores", {
              district: p.features[0].properties.NM_SUBDIST,
            })
          }
        />
      )),
    [polygons]
  );

  const scale = useMemo(() => {
    const x = polygons
      .map((p) => ({
        val: p.indicators[selectedIndicator],
        color: p.color,
      }))
      .sort((a, b) => a.val - b.val);

    const min = parseFloat(x[0].val).toFixed(2);
    const max = parseFloat(x[x.length - 1].val).toFixed(2);

    return {
      colors: [
        ...new Set(
          x.map((v) => hsl2rgb(v.color.substring(5).split(",")[0], 1, 0.5))
        ),
      ],
      min: renderSelectedIndicatorValue(selectedIndicator, min),
      max: renderSelectedIndicatorValue(selectedIndicator, max),
    };
  }, [polygons, selectedIndicator]);

  async function center() {
    const loc = await getUserPosition();
    mapRef?.current?.animateToRegion(loc, 1500);
  }

  if (!location) return <CenterLoading />;

  return (
    <>
      <MapView
        ref={mapRef}
        initialRegion={{
          ...initialRegion,
          latitude: location.latitude,
          longitude: location.longitude,
        }}
        onMapReady={center}
        userLocationPriority="high"
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
        showsBuildings={false}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        showsPointsOfInterest={false}
        zoomControlEnabled={false}
        onTouchStart={() => {
          !state.showDistricts &&
            state.showIndicatorForm &&
            dispatch({
              type: "TOGGLE_INDICATOR_FORM",
            });
        }}
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          tileCacheMaxAge={3600}
          tileSize={256}
          doubleTileSize={true}
        />
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
          mt="32"
          rounded="full"
          icon={
            <FontAwesome5
              name="draw-polygon"
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
          top="40"
          mt={3}
          rounded="full"
          icon={
            <FontAwesome5
              name="map-marker"
              size={25}
              color={state.showQuests ? "#0047AB" : "#8c92ac"}
            />
          }
        />
      )}
      {state.showDistricts && (
        <IconButton
          onPress={() =>
            dispatch({
              type: "TOGGLE_INDICATOR_FORM",
            })
          }
          position="absolute"
          right="3"
          top="48"
          mt={5}
          rounded="full"
          icon={
            <FontAwesome5
              name="calculator"
              size={25}
              color={state.showIndicatorForm ? "#0047AB" : "#8c92ac"}
            />
          }
        />
      )}
      {state.showDistricts && state.showIndicatorForm && (
        <IndicatorForm dispatch={dispatch} />
      )}
      <IconButton
        onPress={() => center()}
        position="absolute"
        right="3"
        bottom="5"
        rounded="full"
        icon={<FontAwesome5 name="compass" size={30} color="#0047AB" />}
      />

      {!!state.showDistricts && (
        <>
          <Text
            position="absolute"
            alignSelf="center"
            bottom="16"
            mb={1}
            bold
            fontSize={15}
            textTransform="capitalize"
            textAlign="center"
          >
            {INDICATORS_LABELS[selectedIndicator].description_short}
          </Text>
          <Flex
            position="absolute"
            alignSelf="center"
            bottom="5"
            rounded="full"
            direction="row"
            justify="space-between"
            align="center"
            px={3}
            w="1/2"
            borderColor="black"
            borderWidth={1}
            bg={{
              linearGradient: {
                colors: scale.colors,
                start: [0, 0],
                end: [1, 1],
              },
            }}
            h={"10"}
          >
            <Text fontWeight="semibold" alignSelf="center">
              {scale.min}
            </Text>
            <Text fontWeight="semibold" alignSelf="center">
              {scale.max}
            </Text>
          </Flex>
        </>
      )}
    </>
  );
}
