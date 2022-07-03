import { createContext, useContext, useEffect, useReducer } from "react";
import { Text } from "react-native";
import { requestUserLocation, watchUserPosition } from "./actions";
import { userLocationReducer } from "./reducer";

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

  useEffect(() => {
    requestUserLocation(dispatch).then(() => watchUserPosition(dispatch));
  }, []);

  if (state.error) {
    return <Text>please enable location</Text>;
  }

  return (
    <UserLocationContext.Provider value={{ state, dispatch }}>
      {children}
    </UserLocationContext.Provider>
  );
}

export const useUserLocation = () => useContext(UserLocationContext);
