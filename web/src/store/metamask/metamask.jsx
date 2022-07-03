import { useToast } from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import { ethers } from "ethers";
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
import { metamaskReducer } from "./reducer";

const { ethereum } = window;

export const metamaskInitialState = {
  account: "",
  provider: undefined,
  signer: undefined,
  contracts: {
    hello: undefined,
  },
  error: undefined,
  loading: false,
};

const MetamaskContext = createContext({ state: metamaskInitialState });

export const useMetamask = () => useContext(MetamaskContext);

export default function MetamaskProvider({ children }) {
  const [state, dispatch] = useReducer(metamaskReducer, metamaskInitialState);
  const toast = useToast();
  const supabase = useSupabase();
  const {
    state: { session },
    actions: { logout },
  } = useUserAuth();

  useEffect(() => {
    if (!ethereum) {
      showBlockchainError({
        code: "Failed to load metamask",
        description: "please install metamask in your browser",
      });

      return;
    }

    dispatch({
      type: "LOAD_PROVIDER",
      payload: new ethers.providers.Web3Provider(ethereum, "any"),
    });
  }, []);

  useEffect(() => {
    if (!state.provider) return;

    console.log("initializing event listeners");

    // https://ethereum.stackexchange.com/questions/102078/detecting-accountschanged-and-chainchanged-with-ethersjs
    const { provider: eth } = state.provider;

    function subscribeNetworkChanges() {
      state.provider.on("network", (_newNetwork, oldNetwork) => {
        if (oldNetwork) {
          window.location.reload();
        }
      });
    }

    function subscribeAccountChanges() {
      eth.on("accountsChanged", ([account]) => {
        console.log(`changing to account: ${account}`);
        dispatch({
          type: "LOGIN",
          payload: account,
        });
      });
    }

    subscribeNetworkChanges();
    subscribeAccountChanges();

    return () => {
      console.log("removing event listeners");

      state.provider.removeAllListeners("network");
      eth.removeAllListeners("accountsChanged");
    };
  }, [state.provider]);

  async function checkDbWalletWithMetamask(dbWallet) {
    toggleLoading(dispatch);

    const [account] = await state.provider.send("eth_requestAccounts", []);

    if (!dbWallet) {
      dispatch({
        type: "LOGIN",
        payload: account,
      });

      const { error } = await supabase.from("profiles").upsert(
        {
          id: session.user.id,
          wallet: account,
          updated_at: new Date(),
        },
        { returning: "minimal" }
      );

      if (error) {
        showBlockchainError({ error });
      }

      toast({
        title: "wallet binded",
        description: "your account is now linked with this wallet",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    if (dbWallet !== account) {
      logout();
      toast({
        title: "wrong metamask account",
        description: "please select your binded wallet",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    dispatch({
      type: "LOGIN",
      payload: account,
    });
  }

  async function getMessageBlockchain() {
    try {
      return state.contracts.hello.getMessage();
    } catch (error) {
      console.log({ error });
      showBlockchainError({
        ...error,
        description: "failed to get contract message",
      });
    }
  }

  async function setMessageBlockchain() {
    toggleLoading(dispatch);
    await state.contracts.hello
      .connect(state.signer)
      .setMessage(faker.random.words(5));
    toggleLoading(dispatch);
  }

  function showBlockchainError({ error }) {
    toast({
      title: `ERROR: ${error.code}`,
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
      checkDbWalletWithMetamask,
      setMessageBlockchain,
      getMessageBlockchain,
    }),
    [state.provider]
  );

  return (
    <MetamaskContext.Provider
      value={{
        state,
        actions,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
}
