import { useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { config } from "../../config";
import { toggleLoading } from "../../utils/actions/start-loading";
import { useUserAuth } from "../auth/provider";
import { useUserProfile } from "../profile/provider";
import { useSupabase } from "../supabase/provider";
import { metamaskReducer } from "./reducer";

const { ethereum } = window;

export const metamaskInitialState = {
  account: "",
  provider: undefined,
  signer: undefined,
  contracts: {
    smartCityGames: undefined,
  },
  error: undefined,
  loading: false,
  values: {
    total: 0,
    userNftMinted: [],
  },
};

const MetamaskContext = createContext({ state: metamaskInitialState });

export const useMetamask = () => useContext(MetamaskContext);

export default function MetamaskProvider({ children }) {
  const [state, dispatch] = useReducer(metamaskReducer, metamaskInitialState);

  const toast = useToast();

  const supabase = useSupabase();

  const {
    actions: { logout },
  } = useUserAuth();

  const {
    state: { wallet },
    actions: { bindWallet },
  } = useUserProfile();

  useEffect(() => {
    if (!checkMetamask()) return;

    async function getContracts() {
      const { signedURL } = await supabase.storage
        .from("assets")
        .createSignedUrl("contract_abi.json", 60);

      const smartCityGames = await fetch(signedURL).then((response) =>
        response.json()
      );

      const provider = new ethers.providers.Web3Provider(ethereum, "any");

      dispatch({
        type: "LOAD_PROVIDER",
        payload: {
          provider,
          contracts: {
            smartCityGames: new ethers.Contract(
              `${config.CONTRACT_HEX}`,
              smartCityGames.abi,
              provider
            ),
          },
        },
      });
    }

    getContracts();
  }, [window.ethereum]);

  useEffect(() => {
    if (!state.provider) return;

    console.log("[METAMASK] initializing event listeners");

    // https://ethereum.stackexchange.com/questions/102078/detecting-accountschanged-and-chainchanged-with-ethersjs
    const { provider: eth } = state.provider;

    function subscribeNetworkChanges() {
      state.provider.on("network", async (newNetwork, oldNetwork) => {
        console.log(
          `[METAMASK] changed from ${oldNetwork?.name ?? null} to ${
            newNetwork?.name
          }`
        );

        if (newNetwork.chainId !== 5) {
          toast({
            title: "wrong network",
            description: "please switch to the goerli network",
            status: "info",
            duration: 5000,
            isClosable: true,
            position: "top",
          });

          await state.provider.send("wallet_switchEthereumChain", [
            {
              chainId: "0x5",
            },
          ]);
        }
      });
    }

    function subscribeAccountChanges() {
      eth.on("accountsChanged", ([account]) => {
        console.log(`[METAMASK] changing to account: ${account}`);

        if (logoutWrongWallet({ wallet, account })) return;

        dispatch({
          type: "LOGIN",
          payload: account,
        });
      });
    }

    subscribeNetworkChanges();
    subscribeAccountChanges();

    return () => {
      console.log("[METAMASK] removing event listeners");

      state.provider.removeAllListeners("network");
      eth.removeAllListeners("accountsChanged");
    };
  }, [state.provider, wallet]);

  function checkMetamask() {
    if (!ethereum) {
      showBlockchainError({
        code: "NO_METAMASK",
        description: "please install metamask in your browser",
      });
    }

    return !!ethereum;
  }

  async function checkWallet(wallet) {
    toggleLoading(dispatch);

    const [account] = await state.provider.send("eth_requestAccounts", []);

    if (!wallet) {
      dispatch({
        type: "LOGIN",
        payload: account,
      });

      await bindWallet(account);
      return;
    }

    if (logoutWrongWallet({ wallet, account })) return;

    dispatch({
      type: "LOGIN",
      payload: account,
    });
  }

  async function getTotalNftMinted() {
    try {
      const total = await state.contracts.smartCityGames.count();

      dispatch({
        type: "UPDATE_CONTRACT_VALUES_TOTAL",
        payload: total.toNumber(),
      });
    } catch (error) {
      showBlockchainError({
        ...error,
        description: "failed to get total nfts minted",
      });
    }
  }

  function logoutWrongWallet({ wallet, account }) {
    if (wallet !== account) {
      logout();
      toast({
        title: "Conta errada do metamask",
        description: "Selecione sua conta vinculada",
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return true;
    }

    return false;
  }

  async function mint(png, supressToast = false) {
    try {
      await state.contracts.smartCityGames
        .connect(state.signer)
        .payToMint(state.account, png, {
          value: ethers.utils.parseEther("0.05"),
        });
      return true;
    } catch (error) {
      showBlockchainError(
        {
          ...error,
          description: `failed to mint nft with CID: ${png}`,
        },
        supressToast
      );
    }
    return false;
  }

  async function mintBatch(nfts) {
    let earned = [];
    for (let nft of nfts) {
      try {
        const ok = await mint(nft.png, true);
        if (ok) earned.push(nft.name);
      } catch (err) {
        console.log({ err });
      }
    }
    return earned;
  }

  async function getMintedTokens() {
    toggleLoading(dispatch);
    try {
      const instance = await state.contracts.smartCityGames.connect(
        state.signer
      );

      const balanceOf = await instance.balanceOf(state.account);
      const prevEarnedTokens = [];
      for (let i = 0; i < balanceOf; i++) {
        const id = await instance.tokenOfOwnerByIndex(state.account, i);
        prevEarnedTokens.push(await instance.tokenURI(id));
      }

      dispatch({
        type: "UPDATE_CONTRACT_VALUES_NFTS",
        payload: prevEarnedTokens,
      });
    } catch (error) {
      console.log({ error });
      showBlockchainError({
        ...error,
        description: "falha ao obter tokens adquiridos anteriores",
      });
    }
  }

  function showBlockchainError(error, supressToast = false) {
    const { code, description, message } = error;

    if (!supressToast) {
      toast({
        title: `ERROR: ${code ?? "unknown"}`,
        description: description ?? message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
    console.error({ error });
    dispatch({ type: "ERROR", payload: error });
  }

  const actions = useMemo(
    () => ({
      checkWallet,
      getTotalNftMinted,
      mint,
      getMintedTokens,
      checkMetamask,
      mintBatch,
    }),
    [state.provider, state.account]
  );

  const dependentActions = useMemo(
    () => ({ checkWallet }),
    [state.provider, state.account, bindWallet]
  );

  return (
    <MetamaskContext.Provider
      value={{
        state,
        actions: { ...actions, ...dependentActions },
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
}
