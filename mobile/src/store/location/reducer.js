import { logger } from "../../utils/logger";

export function userLocationReducer(state, action) {
  logger.info(`[LOCATION] action of type ${action.type} fired`);

  switch (action.type) {
    case "UPDATE_POS": {
      return {
        ...state,
        region: {
          ...action.payload,
          ...state.region,
        },
        error: undefined,
        loading: false,
      };
    }
    case "UPDATE_POS_ZOOM":
      return {
        ...state,
        region: {
          ...state.region,
          ...action.payload.region,
        },
        zoom: action.payload.zoom,
        error: undefined,
        loading: false,
      };
    case "UPDATE_USER_MARKER_INFO": {
      return {
        ...state,
        ownMarker: { ...state.ownMarker, ...action.payload },
        error: undefined,
        loading: false,
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
