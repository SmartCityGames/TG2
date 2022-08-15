import { logger } from "../../utils/logger";

export function indicatorReducer(state, action) {
  logger.info(`[INDICATOR] action of type ${action.type} fired`);

  switch (action.type) {
    case "LOAD_IVS_INDICATORS":
      return {
        ...state,
        indicators: action.payload.data,
        loading: false,
      };
    case "INCREMENT_INDICATORS": {
      const nis = [...state.indicators];
      for (const val of action.payload) {
        const lowerTargetName = val.target.toLowerCase();
        const lowerIndicatorName = val.indicator.toLowerCase();

        let idx = nis.findIndex((i) => i.id === lowerTargetName);
        const indicator = nis[idx];

        nis[idx] = {
          ...indicator,
          [lowerIndicatorName]: Math.min(
            indicator[lowerIndicatorName] + val.amount,
            1
          ),
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
