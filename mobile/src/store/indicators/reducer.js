import { logger } from "../../utils/logger";
import { INDICATORS_LABELS } from "./utils/indicators-labels";
import { minMaxNormalization } from "./utils/min-max-normal";

export function indicatorReducer(state, action) {
  logger.info(`[INDICATOR] action of type ${action.type} fired`);

  switch (action.type) {
    case "LOAD_IVS_INDICATORS":
      return {
        ...state,
        indicators: action.payload.data,
        loading: false,
      };
    case "NORMALIZE_INDICATORS": {
      const indicatorskeys = Object.keys(state.indicators[0]).filter(
        (j) => !!INDICATORS_LABELS[j]
      );

      const indicatorsNormalized = indicatorskeys.reduce((acc, key) => {
        const key_normal = minMaxNormalization(
          state.indicators.map((i) => i[key])
        );
        return acc.map((i, idx) => ({
          ...i,
          [`${key}_normal`]: key_normal[idx],
        }));
      }, state.indicators);

      return {
        ...state,
        indicators: indicatorsNormalized,
      };
    }
    case "INCREMENT_INDICATORS": {
      const nis = [...state.indicators];
      for (const val of action.payload) {
        const lowerTargetName = val.target.toLowerCase();
        const lowerIndicatorName = val.indicator.toLowerCase();
        const op =
          INDICATORS_LABELS[lowerIndicatorName].order === "RG" ? 1 : -1;

        let idx = nis.findIndex((i) => i.id === lowerTargetName);
        const indicator = nis[idx];

        nis[idx] = {
          ...indicator,
          [lowerIndicatorName]: indicator[lowerIndicatorName] + op * val.amount,
        };
      }

      return {
        ...state,
        indicators: nis,
      };
    }
    case "CHANGE_SELECTED_INDICATOR":
      return {
        ...state,
        selectedIndicator: action.payload,
      };
    case "ERROR":
      return {
        ...state,
        error: action.payload ?? "something went wrong",
        loading: false,
      };
    case "LOADING":
      return {
        ...state,
        loading: !state.loading,
      };
    default:
      return state;
  }
}
