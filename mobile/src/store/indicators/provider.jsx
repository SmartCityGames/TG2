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
import { INDICATORS_LABELS } from "./utils/indicators-labels";

const indicatorInitialState = {
  indicators: undefined,
  loading: false,
  error: undefined,
  selectedIndicator: "ivs",
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

    const { data } = await supabase.from("indicators").select(`
    *,
    udhs (
      name
    )
  `);

    const indicators = data.map((i) => ({
      id: i.id,
      udh: i.udhs.name,
      udhs: undefined,
      ...Object.keys(i)
        .filter((j) => !!INDICATORS_LABELS[j])
        .reduce((acc, curr) => ({ ...acc, [curr]: i[curr] }), {}),
    }));

    const espvida = indicators.map((i) => i.espvida);
    const renda_per_capita = indicators.map((i) => i.renda_per_capita);

    const espvidaMax = Math.max(...espvida);
    const espvidaMin = Math.min(...espvida);
    const rendaPerCapitaMax = Math.max(...renda_per_capita);
    const rendaPerCapitaMin = Math.min(...renda_per_capita);

    const espvida_normal = espvida.map(
      (x) => (x - espvidaMin) / (espvidaMax - espvidaMin)
    );
    const renda_per_capita_normal = renda_per_capita.map(
      (x) => (x - rendaPerCapitaMin) / (rendaPerCapitaMax - rendaPerCapitaMin)
    );

    const indicatorsNormalized = indicators.map((i, idx) => ({
      ...i,
      espvida_normal: espvida_normal[idx],
      renda_per_capita_normal: renda_per_capita_normal[idx],
    }));

    dispatch({
      type: "LOAD_IVS_INDICATORS",
      payload: {
        data: indicatorsNormalized,
      },
    });
  }

  async function incrementIndicator(values) {
    await Promise.all(
      values.map((val) => {
        const [tgt] = state.indicators.filter((i) => i.id === val.target);
        const lowerIndicator = val.indicator.toLowerCase();
        return supabase
          .from("indicators")
          .update({
            [lowerIndicator]: tgt[lowerIndicator] + val.amount,
          })
          .eq("id", val.target);
      })
    );

    dispatch({
      type: "INCREMENT_INDICATORS",
      payload: values,
    });
  }

  function changeSelectedIndicator(indicator) {
    dispatch({
      type: "CHANGE_SELECTED_INDICATOR",
      payload: indicator,
    });
  }

  const actions = useMemo(
    () => ({ retrieveIndicators, changeSelectedIndicator }),
    []
  );

  const dependentActions = useMemo(
    () => ({ incrementIndicator }),
    [state.indicators]
  );

  return (
    <IndicatorsContext.Provider
      value={{ state, actions: { ...actions, ...dependentActions } }}
    >
      {children}
    </IndicatorsContext.Provider>
  );
}
