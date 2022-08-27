import { createContext, useContext, useEffect, useReducer } from "react";
import { useUserAuth } from "../auth/provider";
import { useSupabase } from "../supabase/provider";
import { profileReducer } from "./reducer";

const userProfilesInitialState = {
  wallet: "",
  avatar_url: "",
  completed_quests: [],
  username: "",
  error: undefined,
  loading: false,
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

    console.log({ session });

    async function getProfile() {
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
