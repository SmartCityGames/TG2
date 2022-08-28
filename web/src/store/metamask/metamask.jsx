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
import { useSupabase } from "../supabase/provider";
import { metamaskReducer } from "./reducer";

const { ethereum } = window;

const CONTENT_ID = "QmWoAd19aCmkax45YsaH1exYKHk5erv81fMRdMPxgGKmpz";

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
    state: { session },
    actions: { logout },
  } = useUserAuth();

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

  function checkMetamask() {
    if (!ethereum) {
      showBlockchainError({
        code: "NO_METAMASK",
        description: "please install metamask in your browser",
      });
    }

    return !!ethereum;
  }

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

    // if (dbWallet !== account) {
    //   logout();
    //   toast({
    //     title: "wrong metamask account",
    //     description: "please select your binded wallet",
    //     status: "info",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "top",
    //   });
    // return;
    // }

    dispatch({
      type: "LOGIN",
      payload: account,
    });
  }

  async function getTotalNftMinted() {
    try {
      const total = await state.contracts.smartCityGames.count();

      dispatch({
        type: "UPDATE_CONTRACT_VALUES",
        payload: {
          total: total.toNumber(),
        },
      });
    } catch (error) {
      showBlockchainError({
        ...error,
        description: "failed to get total nfts minted",
      });
    }
  }

  async function mint(nft) {
    try {
      const tokenId = `https://gateway.pinata.cloud/ipfs/${CONTENT_ID}/varjao${nft}.png`;
      await state.contracts.smartCityGames
        .connect(state.signer)
        .payToMint(state.account, tokenId, {
          value: ethers.utils.parseEther("0.05"),
        });
    } catch (error) {
      showBlockchainError({
        ...error,
        description: `failed to mint nft ${nft}`,
      });
    }
  }

  async function getMintedTokens() {
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
        type: "UPDATE_CONTRACT_VALUES",
        payload: {
          userNftMinted: prevEarnedTokens,
        },
      });
    } catch (error) {
      console.log({ error });
      showBlockchainError({
        ...error,
        description: "failed to get previous minted tokens",
      });
    }
  }

  function showBlockchainError(error) {
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
      checkDbWalletWithMetamask,
      getTotalNftMinted,
      mint,
      getMintedTokens,
      checkMetamask,
    }),
    [state.provider, state.account]
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
