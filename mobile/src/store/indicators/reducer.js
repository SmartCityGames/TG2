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
        const upperTargetName = val.target.toUpperCase();
        const upperIndicatorName = val.indicator.toUpperCase();

        let idx = nis.findIndex((i) => i.UDH === upperTargetName);
        const indicator = nis[idx];

        nis[idx] = {
          ...indicator,
          [upperIndicatorName]: indicator[upperIndicatorName] + val.amount,
        };
      }

      return {
        ...state,
        indicators: nis,
      };
    }
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
