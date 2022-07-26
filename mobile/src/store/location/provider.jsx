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
  position: undefined,
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
        position: locationObjectToLiteral(loc),
        zoom: mapConfig.maxZoom,
      },
    });
  }

  function onMoveEnd({ position, zoom }) {
    dispatch({
      type: "UPDATE_POS_ZOOM",
      payload: { position, zoom },
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

  const actions = useMemo(
    () => ({
      getUserPosition,
      onMoveEnd,
      addQuestsMarkers,
      removeQuestsMarkers,
    }),
    []
  );

  return (
    <UserLocationContext.Provider value={{ state, actions }}>
      {children}
    </UserLocationContext.Provider>
  );
}
