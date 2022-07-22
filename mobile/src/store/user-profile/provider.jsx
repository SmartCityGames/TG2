import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import AsyncAlert from "../../components/utils/AsyncAlert";
import { useUserAuth } from "../auth/provider";
import { useSupabase } from "../supabase/provider";
import { userProfileReducer } from "./reducer";

const userProfileinitialState = {
  avatar_url: undefined,
  username: undefined,
  wallet: undefined,
  level: 1,
  experience: 0,
};

const UserProfileContext = createContext({
  state: { ...userProfileinitialState },
});

export const useUserProfile = () => useContext(UserProfileContext);

export default function UserProfileProvider({ children }) {
  const [state, dispatch] = useReducer(
    userProfileReducer,
    userProfileinitialState
  );

  const supabase = useSupabase();
  const {
    state: { session },
  } = useUserAuth();

  useEffect(() => {
    if (!session) return;

    async function getProfileToUpdate() {
      updateProfile(await getUserProfile());
    }

    getProfileToUpdate();
  }, [session.user.id]);

  async function getUserProfile() {
    const { data, error } = await supabase
      .from("profiles")
      .select()
      .eq("id", session.user.id);

    if (error) {
      return showUserProfileError({ error });
    } else if (data.length === 0) {
      return showUserProfileError({
        error: {
          status: 500,
          message: "User profile not found",
        },
      });
    }

    return data[0];
  }

  async function updateExperience(amount) {
    console.log(
      `xp from: ${state.experience} to: ${state.experience + amount}`
    );
    const { data, error } = await supabase
      .from("profiles")
      .update({
        experience: state.experience + amount,
      })
      .match({ id: session.user.id });

    if (error) {
      showUserProfileError({ error });
      return;
    }

    updateProfile(data[0]);
  }

  function updateProfile(data) {
    dispatch({
      type: "UPDATE_PROFILE",
      payload: data,
    });
  }

  async function showUserProfileError({ error }) {
    await AsyncAlert(`Status: ${error.status}`, `Error: ${error.message}`);
    dispatch({
      type: "ERROR",
      payload: error?.message,
    });
  }

  const actions = useMemo(
    () => ({
      getUserProfile,
      updateExperience,
      updateProfile,
    }),
    [session]
  );

  return (
    <UserProfileContext.Provider value={{ state, actions }}>
      {children}
    </UserProfileContext.Provider>
  );
}
