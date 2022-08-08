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
  selectedIndicator: "ivs",
};

const IndicatorsContext = createContext({
  state: { ...indicatorInitialState },
});

export const useIndicators = () => useContext(IndicatorsContext);

export const INDICATORS_LABELS = {
  idhm: {
    description: "Municipal Human Development Indicator",
    order: "RG",
  },
  ivs: {
    description: "Social Vulnerability Indicator",
    order: "GR",
  },
};

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

    dispatch({
      type: "LOAD_IVS_INDICATORS",
      payload: {
        data: data.map((d) => ({ ...d, udh: d.udhs.name, udhs: undefined })),
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
