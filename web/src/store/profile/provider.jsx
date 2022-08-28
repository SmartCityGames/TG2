import { createContext, useContext, useEffect, useReducer } from "react";
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

  const {
    state: { session },
  } = useUserAuth();

  const supabase = useSupabase();

  useEffect(() => {
    if (!session) return;

    async function getProfile() {
      toggleLoading(dispatch);

      const { data } = await supabase
        .from("profiles")
        .select()
        .eq("id", session.user.id);
      dispatch({ type: "GET_PROFILE", payload: data[0] });
    }

    getProfile();
  }, [session.user.id]);

  return (
    <UserProfileContext.Provider value={{ state }}>
      {children}
    </UserProfileContext.Provider>
  );
}
