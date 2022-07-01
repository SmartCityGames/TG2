import { Spinner, useToast } from "@chakra-ui/react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import CenteredSpinner from "../../components/CenteredSpinner";
import { startLoading } from "../../utils/start-loading-action";
import { supabase } from "../supabase";
import { authReducer } from "./reducer";

export const authInitialState = {
  session: undefined,
  error: undefined,
  loading: false,
};

const UserAuthContext = createContext({ state: authInitialState });

export const useUserAuth = () => useContext(UserAuthContext);

export default function UserAuthProvider({ children }) {
  const toast = useToast();
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    startLoading(dispatch);
    dispatch({ type: "LOGIN", payload: supabase.auth.session() });
  }, []);

  useEffect(() => {
    const { data: listener, error } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`[SUPABASE:AUTH] action of type ${event} fired`);
        switch (event) {
          case "SIGNED_IN":
            dispatch({ type: "LOGIN", payload: session });
            break;
          case "SIGNED_OUT":
            dispatch({ type: "LOGOUT" });
            break;
        }
      }
    );

    if (error) {
      showAuthError({ error });
    }

    return () => {
      listener.unsubscribe();
    };
  }, []);

  async function login({ email }) {
    const { error } = await supabase.auth.signIn(
      { email },
      { redirectTo: "/" }
    );

    if (error) {
      showAuthError({ error });
    }

    toast({
      title: "Email sent!",
      description: "Check your email account",
      status: "info",
      duration: 8000,
      isClosable: false,
      position: "top",
    });
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      showAuthError({ error });
    }
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

    dispatch({ type: "ERROR", payload: error });
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
      {state.loading ? <CenteredSpinner h="100vh" /> : children}
    </UserAuthContext.Provider>
  );
}
