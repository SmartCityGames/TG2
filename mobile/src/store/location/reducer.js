import { logger } from "../../utils/logger";

export function userLocationReducer(state, action) {
  logger.info(`[LOCATION] action of type ${action.type} fired`);

  switch (action.type) {
    case "UPDATE_POS":
      return {
        ...state,
        position: action.payload,
        marker: {
          ...state.marker,
          position: action.payload,
        },
        error: undefined,
      };
    case "UPDATE_POS_ZOOM":
      return {
        ...state,
        position: action.payload.position,
        zoom: action.payload.zoom,
        error: undefined,
      };
    case "UPDATE_USER_MARKER_INFO": {
      return {
        ...state,
        marker: {
          ...state.marker,
          ...action.payload,
        },
        error: undefined,
      };
    }
    case "LOAD_GEOJSON":
      return {
        ...state,
        geojson: action.payload,
        loading: false,
        error: undefined,
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
