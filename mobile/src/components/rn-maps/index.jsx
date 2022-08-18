import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";
import { Flex, IconButton, Text } from "native-base";
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
import { useIndicators } from "../../store/indicators/provider";
import { SOCIAL_PROSPERITY_MAPPER } from "../../store/indicators/utils/indicators-labels";
import { useUserLocation } from "../../store/location/provider";
import IndicatorForm from "./utils/indicator-form";
import { mapInitialState, mapReducer } from "./utils/reducer";

const rgb2hex = (r, g, b) =>
  `#${[r, g, b]
    .map((x) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, 0)
    )
    .join("")}`;

function hsl2rgb(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

  return rgb2hex(...[f(0), f(8), f(4)]);
}

export default function RnMaps({ polygons, quests }) {
  const mapRef = useRef(null);

  const [state, dispatch] = useReducer(mapReducer, mapInitialState);

  const { navigate } = useNavigation();

  const {
    actions: { removeQuestsMarkers, addQuestsMarkers, getUserPosition },
  } = useUserLocation();

  const {
    state: { selectedIndicator },
  } = useIndicators();

  useEffect(() => {
    center();
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
          onPress={() => {
            state.showIndicatorForm
              ? dispatch({
                  type: "TOGGLE_INDICATOR_FORM",
                })
              : navigate("Indicators", {
                  district: p.features[0].properties.NM_SUBDIST,
                });
          }}
        />
      )),
    [polygons, state.showIndicatorForm]
  );

  const scale = useMemo(() => {
    const x = polygons
      .map((p) => ({
        val: p.indicators[selectedIndicator],
        color: p.color,
      }))
      .sort((a, b) => a.val - b.val);
    // .filter((v, i, a) => (a?.[i + 1]?.val ?? 0) - v.val > 0.00001);

    const min = parseFloat(x[0].val).toFixed(2);
    const max = parseFloat(x[x.length - 1].val).toFixed(2);

    return {
      colors: [
        ...new Set(
          x.map((v) => hsl2rgb(v.color.substring(5).split(",")[0], 1, 0.5))
        ),
      ],
      min:
        selectedIndicator === "prosp_soc"
          ? SOCIAL_PROSPERITY_MAPPER[(Math.floor(min) * 10).toFixed(0)]
          : min,
      max:
        selectedIndicator === "prosp_soc"
          ? SOCIAL_PROSPERITY_MAPPER[(Math.floor(max) * 10).toFixed(0)]
          : max,
    };
  }, [polygons, selectedIndicator]);

  async function center() {
    const loc = await getUserPosition();
    mapRef.current.animateToRegion(loc, 1500);
  }

  return (
    <>
      <MapView
        ref={mapRef}
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
      {!!polygons?.length && (
        <IconButton
          onPress={() =>
            dispatch({
              type: "TOGGLE_INDICATOR_FORM",
            })
          }
          position="absolute"
          right="3"
          top="40"
          mt={5}
          rounded="full"
          icon={
            <FontAwesome
              name="calculator"
              size={25}
              color={state.showIndicatorForm ? "#0047AB" : "#8c92ac"}
            />
          }
        />
      )}
      {state.showIndicatorForm && <IndicatorForm />}
      <IconButton
        onPress={() => center()}
        position="absolute"
        right="3"
        bottom="3"
        rounded="full"
        icon={<FontAwesome name="compass" size={35} color="#0047AB" />}
      />

      {!!state.showDistricts && (
        <Flex
          position={"absolute"}
          alignSelf={"center"}
          bottom={"3"}
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
          <Text fontWeight="bold" alignSelf="center">
            {scale.min}
          </Text>
          <Text fontWeight="bold" alignSelf="center">
            {scale.max}
          </Text>
        </Flex>
      )}
    </>
  );
}
