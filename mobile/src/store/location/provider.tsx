import { LocationSubscription } from "expo-location";
import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { Text } from "react-native";
import { requestUserLocation, watchUserPosition } from "./actions";
import { UserLocationAction, userLocationReducer } from "./reducer";
import { UserLocationState } from "./user-location";

export interface UserLocationContextProps {
  state: UserLocationState;
  dispatch: Dispatch<UserLocationAction>;
}

const UserLocationContext = createContext<UserLocationContextProps>(undefined!);

const userLocationInitialState: UserLocationState = {
  position: null,
  zoom: 17,
  marker: {
    icon: "🧔",
    id: "1",
    position: undefined!,
  },
  error: null,
};

export default function UserLocationProvider({
  children,
}: PropsWithChildren<{}>) {
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
