import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { UserAuthAction, userAuthReducer } from "./reducer";
import { UserAuthState } from "./user";

export interface UserAuthContextProps {
  state: UserAuthState;
  dispatch: Dispatch<UserAuthAction>;
}

const UserAuthContext = createContext<UserAuthContextProps>(undefined!);

const userAuthInitialState: UserAuthState = {
  user: null,
  error: null,
};

export default function UserAuthProvider({ children }: PropsWithChildren<{}>) {
  const [state, dispatch] = useReducer(userAuthReducer, userAuthInitialState);

  return (
    <UserAuthContext.Provider value={{ state, dispatch }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(UserAuthContext);
