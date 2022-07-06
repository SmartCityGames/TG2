import {
  getLastKnownPositionAsync,
  PermissionStatus,
  requestForegroundPermissionsAsync,
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
    id: "1",
    position: undefined,
  },
  error: null,
};

const UserLocationContext = createContext({
  state: { userLocationInitialState },
});

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
      subscription = await watchPositionAsync({ accuracy: 0.7 }, (loc) => {
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

  async function requestUserLocation() {
    const { status } = await requestForegroundPermissionsAsync();

    if (status !== PermissionStatus.GRANTED) {
      dispatch({
        type: "ERROR",
        error: {
          message: "user should grant location permissions",
        },
      });
    }
  }

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
      requestUserLocation,
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

export const useUserLocation = () => useContext(UserLocationContext);
