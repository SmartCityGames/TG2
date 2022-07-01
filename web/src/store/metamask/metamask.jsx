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

  async function getAccount() {
    toggleLoading(dispatch);

    const [account] = await state.provider.send("eth_requestAccounts", []);

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
      getAccount,
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
