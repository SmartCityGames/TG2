import { logger } from "../../utils/logger";

export function userLocationReducer(state, action) {
  logger.info(`[LOCATION] action of type ${action.type} fired`);

  switch (action.type) {
    case "LOAD_GEOJSON":
      return {
        ...state,
        geojson: action.payload,
        loading: false,
        error: undefined,
      };
    case "REMOVE_QUESTS_MARKERS": {
      return {
        ...state,
        markers: state.markers.filter((m) => !m.id.includes("quest")),
        error: undefined,
      };
    }
    case "ADD_QUESTS_MARKERS": {
      return {
        ...state,
        markers: action.payload,
        error: undefined,
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
