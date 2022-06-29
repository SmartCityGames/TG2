import { ethers } from "ethers";
import { createContext, useContext, useEffect, useReducer } from "react";
import { metamaskReducer } from "./reducer";

const MetamaskContext = createContext();

const { ethereum } = window;

export const metamaskInitialState = {
  account: "",
  provider: null,
  signer: null,
  contracts: {
    hello: null,
  },
};

export const useMetamask = () => useContext(MetamaskContext);

export default function MetamaskProvider({ children }) {
  const [state, dispatch] = useReducer(metamaskReducer, metamaskInitialState);

  useEffect(() => {
    ethereum
      ? dispatch({
          type: "LOAD_PROVIDER",
          payload: new ethers.providers.Web3Provider(ethereum, "any"),
        })
      : alert("Please install metamask");
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

  return (
    <MetamaskContext.Provider value={{ state, dispatch }}>
      {children}
    </MetamaskContext.Provider>
  );
}
