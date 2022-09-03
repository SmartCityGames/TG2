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
import { logger } from "../../utils/logger";
import { useSupabase } from "../supabase/provider";
import { userAuthReducer } from "./reducer";

export const userAuthInitialState = {
  session: undefined,
  error: undefined,
  loading: false,
};

const UserAuthContext = createContext({ state: { ...userAuthInitialState } });

export const useUserAuth = () => useContext(UserAuthContext);

export default function UserAuthProvider({ children }) {
  const [state, dispatch] = useReducer(userAuthReducer, userAuthInitialState);
  const supabase = useSupabase();
  const { navigate } = useNavigation();

  useEffect(() => {
    const session = supabase.auth.session();
    if (session) dispatch({ type: "SIGNIN", payload: session });
  }, []);

  useEffect(() => {
    const { data: listener, error } = supabase.auth.onAuthStateChange(
      (event, session) => {
        logger.info(`[SUPABASE:AUTH] action of type ${event} fired`);
        switch (event) {
          case "SIGNED_IN":
            if (!state.session) {
              dispatch({ type: "SIGNIN", payload: session });
            }
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

  async function signup({ email, password, username }) {
    toggleLoading(dispatch);

    const { error } = await supabase.auth.signUp(
      {
        email,
        password,
      },
      {
        data: {
          username,
        },
      }
    );

    if (error) {
      await showAuthError({ error });
      return;
    }

    await AsyncAlert(
      "Email de confirmação enviado",
      "Por favor cheque seu email!"
    );
    toggleLoading(dispatch);
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      await showAuthError({ error });
      return;
    }

    navigate("Entrar", {
      replace: true,
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
