import { useNavigation } from "@react-navigation/native";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import AsyncAlert from "../../components/utils/AsyncAlert";
import { toggleLoading } from "../../utils/actions/start-loading";
import { useSupabase } from "../supabase/provider";
import { userAuthReducer } from "./reducer";

export const userAuthInitialState = {
  session: undefined,
  error: undefined,
  loading: false,
};

const UserAuthContext = createContext({ state: userAuthInitialState });

export default function UserAuthProvider({ children }) {
  const [state, dispatch] = useReducer(userAuthReducer, userAuthInitialState);
  const navigation = useNavigation();
  const supabase = useSupabase();

  useEffect(() => {
    dispatch({ type: "SIGNIN", payload: supabase.auth.session() });
  }, []);

  useEffect(() => {
    const { data: listener, error } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log(`[SUPABASE:AUTH] action of type ${event} fired`);
        switch (event) {
          case "SIGNED_IN":
            dispatch({ type: "SIGNIN", payload: session });
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

  async function signin({ email, password }) {
    toggleLoading(dispatch);

    const { error, session } = await supabase.auth.signIn({
      email: email,
      password: password,
    });

    if (error) {
      await showAuthError({ error });
      return;
    }

    dispatch({
      type: "SIGNIN",
      payload: session,
    });
  }

  async function signup({ email, password }) {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      await showAuthError({ error });
      return;
    }

    await AsyncAlert("Email confirmation sent", "Please check your email!");

    navigation.navigate("SignIn");
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      await showAuthError({ error });
    }

    dispatch({
      type: "LOGOUT",
    });
  }

  async function showAuthError({ error }) {
    await AsyncAlert(`Status: ${error.status}`, `Error: ${error.message}`);
    dispatch({
      type: "ERROR",
      payload: error?.message,
    });
  }

  const actions = useMemo(
    () => ({
      signin,
      signup,
      logout,
    }),
    []
  );

  return (
    <UserAuthContext.Provider value={{ state, actions }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export const useUserAuth = () => useContext(UserAuthContext);
