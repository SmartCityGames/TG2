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
import { mapConfig } from "../../components/map/utils/config";
import { toggleLoading } from "../../utils/actions/start-loading";
import { sanitizeText } from "../../utils/sanitize-text";
import { useUserAuth } from "../auth/provider";
import { useSupabase } from "../supabase/provider";
import { userLocationReducer } from "./reducer";
import { generateEmojiMarker } from "./utils/generate-emoji-marker";
import { locationObjectToLiteral } from "./utils/loc-obj-to-literal";

const userLocationInitialState = {
  ownMarker: {
    icon: undefined,
    id: undefined,
    position: undefined,
    size: [32, 32],
  },
  region: {
    latitudeDelta: 0.014,
    longitudeDelta: 0.014,
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
  const {
    state: { session },
  } = useUserAuth();
  const supabase = useSupabase();

  useEffect(() => {
    dispatch({
      type: "UPDATE_USER_MARKER_INFO",
      payload: {
        id: session.user.email,
        icon: generateEmojiMarker(),
      },
    });
  }, [session.user]);

  useEffect(() => {
    toggleLoading(dispatch);
    getUserPosition();
  }, []);

  useEffect(() => {
    async function getGeojson() {
      toggleLoading(dispatch);

      const { signedURL } = await supabase.storage
        .from("assets")
        .createSignedUrl("geojson/polygon-subdistrict-2017.geojson", 60);

      const geojson = await fetch(signedURL).then((response) =>
        response.json()
      );

      dispatch({
        type: "LOAD_GEOJSON",
        payload: {
          ...geojson,
          features: geojson.features.map((feature) => {
            return {
              ...feature,
              properties: {
                ...feature.properties,
                NM_SUBDIST: sanitizeText(feature.properties.NM_SUBDIST),
              },
            };
          }),
        },
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
        { accuracy: LocationAccuracy.BestForNavigation, timeInterval: 1000 },
        (_loc) => {
          // const domain = locationObjectToLiteral(loc);
          // console.log({ domain });
          // dispatch({
          //   type: "UPDATE_POS",
          //   payload: domain,
          // });
          // this leads to high memory consumption
          // retrieveQuests(domain);
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

    if (!loc) return;

    dispatch({
      type: "UPDATE_POS_ZOOM",
      payload: {
        region: locationObjectToLiteral(loc),
        zoom: mapConfig.maxZoom,
      },
    });
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

  return (
    <UserLocationContext.Provider value={{ state, actions }}>
      {children}
    </UserLocationContext.Provider>
  );
}
