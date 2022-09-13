import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { Linking } from "react-native";
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
  completed_quests: [],
  collected_nfts: [],
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
    actions: { logout },
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
      showUserProfileError({
        error: {
          status: 500,
          message: "Usuário sem perfil associado",
        },
      });
      return logout();
    }

    return data[0];
  }

  async function updateExperience({ amount, questId }) {
    const xp = state.experience + amount;
    const xpLevel = state.level * MAX_XP_PER_LEVEL;

    const { data, error } = await supabase
      .from("profiles")
      .update(
        {
          level: xp >= xpLevel ? state.level + 1 : state.level,
          experience: xp >= xpLevel ? xp - xpLevel : xp,
          completed_quests: [...state.completed_quests, questId],
        },
        {
          returning: "representation",
        }
      )
      .eq("id", session.user.id);

    if (error) {
      showUserProfileError({ error });
      return;
    }

    updateProfile(data[0]);
  }

  async function updateProfilePicture(avatar_url) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ avatar_url }, { returning: "representation" })
      .eq("id", session.user.id);

    if (error) {
      showUserProfileError({ error });
      return;
    }

    updateProfile(data[0]);
  }

  async function updateOwnedNfts({ nft }) {
    const dapp = "tg2-scyg-front.herokuapp.com/";
    const url = `metamask://dapp/${dapp}`;
    const supported = await Linking.canOpenURL(url);

    if (!state.wallet) {
      await AsyncAlert(
        "ops... não conseguimos enviar seu NFT! 😢",
        "Você precisa ter uma carteira associada a sua conta para receber NFTs. Por favor, associe uma carteira virtual.",
        (resolve, _) => [
          {
            text: "Vá ao site para configurar",
            onPress: async () => {
              await Linking.openURL(supported ? url : `https://${dapp}`);
              resolve();
            },
          },
          {
            text: "Ignorar",
            onPress: () => {
              resolve();
            },
          },
        ]
      );
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(
        { collected_nfts: [...state.collected_nfts, nft] },
        { returning: "representation" }
      )
      .eq("id", session.user.id);

    if (error) {
      showUserProfileError({ error });
      return;
    }

    updateProfile(data[0]);

    if (state.wallet) {
      await AsyncAlert(
        "Você acabou de ter possibilidade de ganhar um NFT!! 🎉",
        "NFTs só podem ser resgatados pelo site.",
        (resolve, _) => [
          {
            text: "Vá ao site para resgatar",
            onPress: async () => {
              await Linking.openURL(supported ? url : `https://${dapp}`);
              resolve();
            },
          },
          {
            text: "Ignorar",
            onPress: () => {
              resolve();
            },
          },
        ]
      );
    }
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
      updateProfile,
      updateProfilePicture,
    }),
    [session]
  );

  const dependentActions = useMemo(
    () => ({
      updateExperience,
      updateOwnedNfts,
    }),
    [session.user.id, state.experience, state.completed_quests, state.wallet]
  );

  return (
    <UserProfileContext.Provider
      value={{ state, actions: { ...actions, ...dependentActions } }}
    >
      {children}
    </UserProfileContext.Provider>
  );
}
