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
  indicators: undefined,
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

    const indicators = await fetch(signedURL).then((response) =>
      response.json()
    );

    dispatch({
      type: "LOAD_IVS_INDICATORS",
      payload: indicators,
    });
  }

  function incrementIndicator(values) {
    dispatch({
      type: "INCREMENT_INDICATORS",
      payload: values,
    });
  }

  const actions = useMemo(
    () => ({ retrieveIndicators, incrementIndicator }),
    []
  );

  return (
    <IndicatorsContext.Provider value={{ state, actions }}>
      {children}
    </IndicatorsContext.Provider>
  );
}
