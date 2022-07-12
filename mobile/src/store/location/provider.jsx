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
import { useUserAuth } from "../auth/provider";
import { userLocationReducer } from "./reducer";
import { locationObjectToLiteral } from "./utils/loc-obj-to-literal";

const userLocationInitialState = {
  position: null,
  zoom: 17,
  marker: {
    icon: "🧔",
    id: undefined,
    position: undefined,
  },
  error: null,
  loading: false,
};

const UserLocationContext = createContext({
  state: { userLocationInitialState },
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

  useEffect(() => {
    let subscription;

    async function getSubscription() {
      const { granted: ok } = await getForegroundPermissionsAsync();
      if (!ok) return;

      subscription = await watchPositionAsync({ accuracy: LocationAccuracy.BestForNavigation }, (loc) => {
        dispatch({
          type: "UPDATE_POS",
          payload: locationObjectToLiteral(loc),
        });
      });
    }

    getSubscription();

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    updateUserMarkerInfo(session.user);
  }, [session]);

  async function getUserPosition() {
    const loc = await getLastKnownPositionAsync();

    if (!loc) return;

    dispatch({
      type: "UPDATE_POS_ZOOM",
      payload: {
        position: locationObjectToLiteral(loc),
        zoom: 17,
      },
    });
  }

  function updateUserMarkerInfo(user) {
    dispatch({
      type: "UPDATE_USER_MARKER_INFO",
      payload: {
        id: user.email,
      },
    });
  }

  function onMoveEnd({ position, zoom }) {
    dispatch({
      type: "UPDATE_POS_ZOOM",
      payload: { position, zoom },
    });
  }

  const actions = useMemo(
    () => ({
      getUserPosition,
      onMoveEnd,
    }),
    []
  );

  return (
    <UserLocationContext.Provider value={{ state, actions }}>
      {children}
    </UserLocationContext.Provider>
  );
}
