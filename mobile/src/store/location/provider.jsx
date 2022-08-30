import { getLastKnownPositionAsync } from "expo-location";
import GeoJsonGeometriesLookup from "geojson-geometries-lookup";
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

  useEffect(() => {
    async function getGeojson() {
      toggleLoading(dispatch);

      const { signedURL } = await supabase.storage
        .from("assets")
        .createSignedUrl("geojson/polygon-subdistrict-2017.geojson", 60);

      const [geojsonFile, { data: udhs }] = await Promise.all([
        fetch(signedURL).then((response) => response.json()),
        supabase.from("udhs").select(),
      ]);

      const geojson = {
        ...geojsonFile,
        features: geojsonFile.features.map((feature) => {
          const sanitizedName = sanitizeText(feature.properties.NM_SUBDIST);

          const udh = udhs.find(
            (u) =>
              sanitizeText(u.name).toLowerCase() === sanitizedName.toLowerCase()
          );

          return {
            ...feature,
            properties: {
              ...feature.properties,
              NM_SUBDIST: sanitizeText(feature.properties.NM_SUBDIST),
              ID_SUPABASE: udh.id,
            },
          };
        }),
      };

      dispatch({
        type: "LOAD_GEOJSON",
        payload: geojson,
      });
    }

    getGeojson();
  }, []);

  async function getUserPosition() {
    const loc = await getLastKnownPositionAsync();

    if (!loc) return null;

    return {
      ...locationObjectToLiteral(loc),
      latitudeDelta: 0.003,
      longitudeDelta: 0.002,
    };
  }

  function getPolygonWhichGeometryLies(geometry) {
    return geojsonLookup?.getContainers(geometry).features[0];
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
        actions: { ...actions, ...dependentActions },
      }}
    >
      {children}
    </UserLocationContext.Provider>
  );
}
