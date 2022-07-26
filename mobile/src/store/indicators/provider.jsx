import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { toggleLoading } from "../../utils/actions/start-loading";
import { useSupabase } from "../supabase/provider";
import { indicatorReducer } from "./reducer";

const indicatorInitialState = {
  ivs: undefined,
  loading: false,
  error: undefined,
};

const IndicatorsContext = createContext({
  state: { ...indicatorInitialState },
});

export const useIndicators = () => useContext(IndicatorsContext);

export default function IndicatorsProvider({ children }) {
  const [state, dispatch] = useReducer(indicatorReducer, indicatorInitialState);
  const supabase = useSupabase();

  useEffect(() => {
    retrieveIndicators();
  }, []);

  async function retrieveIndicators() {
    toggleLoading(dispatch);

    const { signedURL } = await supabase.storage
      .from("assets")
      .createSignedUrl("indicadores/ivs.json", 60);

    const ivs = await fetch(signedURL).then((response) => response.json());

    dispatch({
      type: "LOAD_IVS_INDICATORS",
      payload: ivs,
    });
  }

  const actions = useMemo(() => ({ retrieveIndicators }), []);

  return (
    <IndicatorsContext.Provider value={{ state, actions }}>
      {children}
    </IndicatorsContext.Provider>
  );
}
