import { useToast } from "@chakra-ui/react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { toggleLoading } from "../../utils/actions/start-loading";
import { useUserAuth } from "../auth/provider";
import { useSupabase } from "../supabase/provider";
import { profileReducer } from "./reducer";

const userProfilesInitialState = {
  avatar_url: undefined,
  username: undefined,
  wallet: undefined,
  level: 1,
  experience: 0,
  completed_quests: [],
  loading: false,
  error: undefined,
  collected_nfts: [],
};

const UserProfileContext = createContext({
  state: { ...userProfilesInitialState },
});

export const useUserProfile = () => useContext(UserProfileContext);

export default function UserProfileProvider({ children }) {
  const [state, dispatch] = useReducer(
    profileReducer,
    userProfilesInitialState
  );

  const toast = useToast();

  const {
    state: { session },
  } = useUserAuth();

  const supabase = useSupabase();

  useEffect(() => {
    if (!session) return;

    getProfile();
  }, [session.user.id]);

  async function getProfile() {
    toggleLoading(dispatch);

    const { data } = await supabase
      .from("profiles")
      .select()
      .eq("id", session.user.id);

    dispatch({ type: "GET_PROFILE", payload: data[0] });
  }

  async function updateProfile({ username }) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ username }, { returning: "representation" })
      .eq("id", session.user.id);

    if (error) {
      showProfileError({ error });
      return;
    }

    dispatch({ type: "UPDATE_PROFILE", payload: data[0] });

    toast({
      title: `profile updated`,
      description: "your informations has been saved",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }

  function showProfileError(error) {
    const { code, description, message } = error;

    toast({
      title: `ERROR: ${code ?? "unknown"}`,
      description: description ?? message,
      status: "error",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    console.error({ error });
    dispatch({ type: "ERROR", payload: error });
  }

  const actions = useMemo(
    () => ({
      updateProfile,
    }),
    [session.user.id]
  );

  return (
    <UserProfileContext.Provider value={{ state, actions }}>
      {children}
    </UserProfileContext.Provider>
  );
}
