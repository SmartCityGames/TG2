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
import { shortenAccount } from "../../utils/shorten-account";

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
      title: "Perfil Atualizado",
      description: "Suas informações foram atualizadas com sucesso!",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }

  async function updateCollectedNfts(nfts) {
    if (!nfts.length) return;

    const newNfts = state.collected_nfts.map((a) =>
      nfts.find((b) => a.name === b) ? { ...a, taken: true } : a
    );

    const { data, error } = await supabase
      .from("profiles")
      .update({ collected_nfts: newNfts }, { returning: "representation" })
      .eq("id", session.user.id);

    if (error) {
      showProfileError({ error });
      return;
    }

    dispatch({ type: "UPDATE_PROFILE", payload: data[0] });

    toast({
      title: `NFTs adicionados à sua conta!`,
      description: "recarregue a página para vê-los",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
  }

  async function bindWallet(wallet) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ wallet }, { returning: "representation" })
      .eq("id", session.user.id);

    if (error) {
      showProfileError({ error });
      return;
    }

    dispatch({ type: "UPDATE_PROFILE", payload: data[0] });

    toast({
      title: "Carteira virtual adicionada",
      description: `sua conta está agora associada à carteira ${shortenAccount(
        wallet
      )}`,
      status: "success",
      duration: 5000,
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
      updateCollectedNfts,
      bindWallet,
    }),
    [session.user.id]
  );

  return (
    <UserProfileContext.Provider value={{ state, actions }}>
      {children}
    </UserProfileContext.Provider>
  );
}
