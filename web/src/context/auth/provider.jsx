import { createContext, useContext, useReducer } from "react";
import { authReducer } from "./reducer";

const UserAuthContext = createContext();

export default function UserAuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: undefined,
  });

  return (
    <UserAuthContext.Provider value={{ state, dispatch }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(UserAuthContext);
