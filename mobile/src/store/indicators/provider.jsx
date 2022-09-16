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

    dispatch({
      type: "LOAD_IVS_INDICATORS",
      payload: {
        data: indicators,
      },
    });

    dispatch({
      type: "NORMALIZE_INDICATORS",
    });
  }

  async function incrementIndicator(values) {
    await Promise.all(
      values.map((val) => {
        const tgt = state.indicators.find((i) => i.id === val.target);
        const lowerIndicator = val.indicator.toLowerCase();
        const op = INDICATORS_LABELS[lowerIndicator].order === "RG" ? 1 : -1;

        return supabase
          .from("indicators")
          .update({
            [lowerIndicator]: tgt[lowerIndicator] + op * val.amount,
          })
          .eq("id", val.target);
      })
    );

    dispatch({
      type: "INCREMENT_INDICATORS",
      payload: values,
    });

    dispatch({
      type: "NORMALIZE_INDICATORS",
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
