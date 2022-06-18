import { useEffect, useReducer, createContext, useContext } from "react";
import { metamaskReducer } from "./reducer";
import { ethers } from "ethers";

const MetamaskContext = createContext();

const { ethereum } = window;

export default function MetamaskProvider({ children }) {
  const [state, dispatch] = useReducer(metamaskReducer, {
    account: "",
    provider: null,
  });

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
    const { provider: internalProvider } = state.provider;

    function subscribeNetworkChanges() {
      state.provider.on("network", (_newNetwork, oldNetwork) => {
        if (oldNetwork) {
          window.location.reload();
        }
      });
    }

    function subscribeAccountChanges() {
      internalProvider.on("accountsChanged", ([account]) => {
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

      state.provider.off("network");
      internalProvider.off("accountsChanged");
    };
  }, [state.provider]);

  return (
    <MetamaskContext.Provider value={{ state, dispatch }}>
      {children}
    </MetamaskContext.Provider>
  );
}

export const useMetamask = () => useContext(MetamaskContext);
