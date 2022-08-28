import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { useSupabase } from "../supabase/provider";
import { nftReducer } from "./reducer";

const nftInitialState = {
  nfts: {},
};

const NftContext = createContext({ state: { ...nftInitialState } });

export const useNft = () => useContext(NftContext);

export default function NftProvider({ children }) {
  const [state, dispatch] = useReducer(nftReducer, nftInitialState);

  const supabase = useSupabase();

  useEffect(() => {
    async function getAllNfts() {
      const { signedURL } = await supabase.storage
        .from("assets")
        .createSignedUrl("grouped-ipfs-nfts.json", 60);

      const nfts = await fetch(signedURL).then((response) => response.json());

      dispatch({
        type: "LOAD_NFTS",
        payload: nfts,
      });
    }

    getAllNfts();
  }, []);

  function getRandomNft() {
    const n = String(0);
    return {
      ...state.nfts[n],
      name: n,
    };
  }

  const actions = useMemo(() => ({ getRandomNft }), []);

  return (
    <NftContext.Provider value={{ state, actions }}>
      {children}
    </NftContext.Provider>
  );
}
