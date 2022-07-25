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

export const MAX_XP_PER_LEVEL = 700;

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
    const xp = state.experience + amount;
    const xpLevel = state.level * MAX_XP_PER_LEVEL;

    const { data, error } = await supabase
      .from("profiles")
      .update(
        {
          level: xp >= xpLevel ? state.level + 1 : state.level,
          experience: xp >= xpLevel ? xp - xpLevel : xp,
        },
        {
          returning: "representation",
        }
      )
      .eq("id", session.user.id);

    console.log({
      anewProfile: data,
      error,
    });

    if (error) {
      showUserProfileError({ error });
      return;
    }

    updateProfile(data[0]);
  }

  function updateProfile(data) {
    if (data) {
      dispatch({
        type: "UPDATE_PROFILE",
        payload: data,
      });
    }
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
    }),
    [session]
  );

  const dependentActions = useMemo(
    () => ({
      updateExperience,
      updateProfile,
    }),
    [session.user.id, state.experience]
  );

  return (
    <UserProfileContext.Provider
      value={{ state, actions: { ...actions, ...dependentActions } }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}
