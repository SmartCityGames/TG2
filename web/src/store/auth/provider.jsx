import { useToast } from "@chakra-ui/react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { toggleLoading } from "../../utils/actions/start-loading";
import { useSupabase } from "../supabase/provider";
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
  const supabase = useSupabase();

  useEffect(() => {
    toggleLoading(dispatch);
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
    toggleLoading(dispatch);
    const { error } = await supabase.auth.signIn(
      { email },
      { redirectTo: "/" }
    );
    toggleLoading(dispatch);

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
      description: error.description ?? error.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
    console.log({ error });
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
      {children}
    </UserAuthContext.Provider>
  );
}
