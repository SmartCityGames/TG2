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
import { mapConfig } from "../../components/map/config";
import { toggleLoading } from "../../utils/actions/start-loading";
import { generateEmojis } from "../../utils/generate-emojis";
import { useUserAuth } from "../auth/provider";
import { useQuests } from "../quests/provider";
import { useSupabase } from "../supabase/provider";
import { userLocationReducer } from "./reducer";
import { locationObjectToLiteral } from "./utils/loc-obj-to-literal";

const userLocationInitialState = {
  position: null,
  zoom: 17,
  markers: [
    {
      icon: undefined,
      id: undefined,
      position: undefined,
      size: [32, 32],
    },
  ],
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
  const {
    actions: { retrieveQuests },
  } = useQuests();

  useEffect(() => {
    let subscription;

    async function getSubscription() {
      const { granted: ok } = await getForegroundPermissionsAsync();
      if (!ok) return;

      subscription = await watchPositionAsync(
        { accuracy: LocationAccuracy.Highest },
        (loc) => {
          const domain = locationObjectToLiteral(loc);
          dispatch({
            type: "UPDATE_POS",
            payload: domain,
          });
          retrieveQuests(domain);
        }
      );
    }

    getSubscription();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    async function getGeojson() {
      toggleLoading(dispatch);

      const { signedURL } = await supabase.storage
        .from("assets")
        .createSignedUrl("geojson/polygon-subdistrict.geojson", 60);

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
    dispatch({
      type: "UPDATE_USER_MARKER_INFO",
      payload: {
        id: session.user.email,
        icon: generateEmojis()[0],
      },
    });
  }, [session.user]);

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
