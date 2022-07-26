import { logger } from "../../utils/logger";

export function indicatorReducer(state, action) {
  logger.info(`[INDICATOR] action of type ${action.type} fired`);

  switch (action.type) {
    case "LOAD_IVS_INDICATORS":
      return {
        ...state,
        ivs: action.payload.data,
        loading: false,
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
