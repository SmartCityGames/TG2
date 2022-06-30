import { useToast } from "@chakra-ui/react";
import { createContext, useContext, useMemo, useReducer } from "react";
import { authReducer } from "./reducer";
import { supabase } from "../supabase";
import { startLoading } from "../../utils/start-loading-action";

export const authInitialState = {
  user: undefined,
  error: undefined,
  loading: false,
};

const UserAuthContext = createContext({ state: authInitialState });

export const useUserAuth = () => useContext(UserAuthContext);

export default function UserAuthProvider({ children }) {
  const toast = useToast();
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  async function login({ email, password }) {
    startLoading(dispatch);

    const { user, error } = await supabase.auth.signIn({
      email,
      password,
    });

    if (error) {
      showAuthError({ error });
      return;
    }

    dispatch({
      type: "LOGIN",
      payload: user,
    });
  }

  function logout() {
    dispatch({
      type: "LOGOUT",
    });
  }

  function showAuthError({ error }) {
    toast({
      title: `status: ${error.status}`,
      description: error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top",
    });

    dispatch({
      type: "ERROR",
      payload: error,
    });
  }

  const actions = useMemo(
    () => ({
      login,
      logout,
      showAuthError,
    }),
    []
  );

  return (
    <UserAuthContext.Provider value={{ state, actions }}>
      {children}
    </UserAuthContext.Provider>
  );
}
