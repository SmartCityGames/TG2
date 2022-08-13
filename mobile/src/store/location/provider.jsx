import {
  getForegroundPermissionsAsync,
  getLastKnownPositionAsync,
  LocationAccuracy,
  watchPositionAsync,
} from "expo-location";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Dimensions } from "react-native";
import { mapConfig } from "../../components/map/utils/config";
import { toggleLoading } from "../../utils/actions/start-loading";
import { sanitizeText } from "../../utils/sanitize-text";
import { useSupabase } from "../supabase/provider";
import { userLocationReducer } from "./reducer";
import { locationObjectToLiteral } from "./utils/loc-obj-to-literal";
import GeoJsonGeometriesLookup from "geojson-geometries-lookup";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGTITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const userLocationInitialState = {
  ownMarker: {
    icon: undefined,
    id: undefined,
    position: undefined,
    size: [32, 32],
  },
  region: {
    latitude: 0,
    longitude: 0,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGTITUDE_DELTA,
  },
  zoom: mapConfig.maxZoom,
  markers: [],
  geojson: undefined,
  error: null,
  loading: false,
};

const UserLocationContext = createContext({
  state: { ...userLocationInitialState },
});

export const useUserLocation = () => useContext(UserLocationContext);

export default function UserLocationProvider({ children }) {
  const [state, dispatch] = useReducer(
    userLocationReducer,
    userLocationInitialState
  );

  const supabase = useSupabase();

  const geojsonLookup = useMemo(
    () =>
      state.geojson
        ? new GeoJsonGeometriesLookup({
            type: "FeatureCollection",
            features: state.geojson.features,
          })
        : null,
    [state.geojson]
  );

  //* users already have an icon
  // useEffect(() => {
  //   dispatch({
  //     type: "UPDATE_USER_MARKER_INFO",
  //     payload: {
  //       id: session.user.email,
  //       icon: generateEmojiMarker(),
  //     },
  //   });
  // }, [session.user]);

  useEffect(() => {
    async function getGeojson() {
      toggleLoading(dispatch);

      const { signedURL } = await supabase.storage
        .from("assets")
        .createSignedUrl("geojson/polygon-subdistrict-2017.geojson", 60);

      const geojsonFile = await fetch(signedURL).then((response) =>
        response.json()
      );

      const geojson = {
        ...geojsonFile,
        features: geojsonFile.features.map((feature) => ({
          ...feature,
          properties: {
            ...feature.properties,
            NM_SUBDIST: sanitizeText(feature.properties.NM_SUBDIST),
          },
        })),
      };

      dispatch({
        type: "LOAD_GEOJSON",
        payload: geojson,
      });
    }

    getGeojson();
  }, []);

  useEffect(() => {
    let subscription;

    async function getSubscription() {
      const { granted: ok } = await getForegroundPermissionsAsync();
      if (!ok) return;

      subscription = await watchPositionAsync(
        { accuracy: LocationAccuracy.BestForNavigation, timeInterval: 3000 },
        (_loc) => {
          dispatch({ type: "FAKE_UPDATE_NEARBY_QUESTS" });
          // updateUsersNearbyQuests(loc);
        }
      );
    }

    getSubscription();

    return () => {
      subscription?.remove();
    };
  }, []);

  async function getUserPosition() {
    const loc = await getLastKnownPositionAsync();

    if (!loc) return null;

    return {
      ...locationObjectToLiteral(loc),
      latitudeDelta: 0.003,
      longitudeDelta: 0.002,
    };

    //* theres no need to manipulate the region
    // dispatch({
    //   type: "UPDATE_POS_ZOOM",
    //   payload: {
    //     region,
    //     zoom: Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2),
    //   },
    // });

    // return region;
  }

  function getPolygonWhichGeometryLies(geometry) {
    return geojsonLookup.getContainers(geometry).features[0];
  }

  function addQuestsMarkers(quests) {
    dispatch({
      type: "ADD_QUESTS_MARKERS",
      payload: quests,
    });
  }

  function removeQuestsMarkers() {
    dispatch({
      type: "REMOVE_QUESTS_MARKERS",
    });
  }

  function updateRegion(region) {
    dispatch({
      type: "UPDATE_POS",
      payload: region,
    });
  }

  const actions = useMemo(
    () => ({
      getUserPosition,
      addQuestsMarkers,
      removeQuestsMarkers,
      updateRegion,
    }),
    []
  );

  const dependentActions = useMemo(
    () => ({ getPolygonWhichGeometryLies }),
    [state.geojson]
  );

  return (
    <UserLocationContext.Provider
      value={{
        state,
        geojsonLookup,
        actions: { ...actions, ...dependentActions },
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
}
