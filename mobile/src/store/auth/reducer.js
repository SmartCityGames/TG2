import { logger } from "../../utils/logger";

export function userAuthReducer(state, action) {
  logger.info(`[AUTH] action of type ${action.type} fired`);

  switch (action.type) {
    case "SIGNIN":
      return {
        ...state,
        session: action.payload,
        error: undefined,
        loading: false,
      };
    case "ERROR":
      return {
        ...state,
        session: undefined,
        error: action.payload ?? "something went wrong",
        loading: false,
      };
    case "LOGOUT":
      return {
        session: undefined,
        error: undefined,
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
