import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { startLoading } from "../../utils/start-loading-action";
import { metamaskReducer } from "./reducer";

const MetamaskContext = createContext();

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

export const useMetamask = () => useContext(MetamaskContext);

export default function MetamaskProvider({ children }) {
  const [state, dispatch] = useReducer(metamaskReducer, metamaskInitialState);
  const toast = useToast();

  useEffect(() => {
    if (!ethereum) {
      toast({
        title: "Failed to load metamask",
        description: "please install metamask in your browser",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      dispatch({
        type: "ERROR",
        payload: "please install metamask in your browser",
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
    startLoading();

    const [account] = await state.provider.send("eth_requestAccounts", []);

    dispatch({
      type: "LOGIN",
      payload: account,
    });
  }

  const actions = useMemo(() => ({
    getAccount,
  }));

  return (
    <MetamaskContext.Provider value={{ state, actions }}>
      {children}
    </MetamaskContext.Provider>
  );
}
