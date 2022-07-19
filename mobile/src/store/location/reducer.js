import { logger } from "../../utils/logger";

export function userLocationReducer(state, action) {
  logger.info(`[LOCATION] action of type ${action.type} fired`);

  switch (action.type) {
    case "UPDATE_POS": {
      const userMarker = state.markers.shift();
      return {
        ...state,
        position: action.payload,
        markers: [
          {
            ...userMarker,
            position: action.payload,
          },
          ...state.markers,
        ],
        error: undefined,
      };
    }
    case "UPDATE_POS_ZOOM":
      return {
        ...state,
        position: action.payload.position,
        zoom: action.payload.zoom,
        error: undefined,
      };
    case "UPDATE_USER_MARKER_INFO": {
      const userMarker = state.markers.shift();
      return {
        ...state,
        markers: [{ ...userMarker, ...action.payload }, ...state.markers],
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
    case "REMOVE_QUESTS_MARKERS": {
      const userMarker = state.markers.shift();
      return {
        markers: [userMarker],
        error: undefined,
      };
    }
    case "ADD_QUESTS_MARKERS":
      return {
        markers: [...state.markers, ...action.payload],
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
