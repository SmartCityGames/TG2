import { createContext, useContext, useReducer } from "react";
import { userAuthReducer } from "./reducer";

const userAuthInitialState = {
  user: undefined,
  error: undefined,
};

const UserAuthContext = createContext({ state: userAuthInitialState });

export default function UserAuthProvider({ children }) {
  const [state, dispatch] = useReducer(userAuthReducer, userAuthInitialState);

  return (
    <UserAuthContext.Provider value={{ state, dispatch }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(UserAuthContext);
