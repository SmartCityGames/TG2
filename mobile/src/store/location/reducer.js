export function userLocationReducer(state, action) {
  switch (action.type) {
    case "UPDATE_POS":
      return {
        ...state,
        position: action.payload,
        marker: {
          ...state.marker,
          position: action.payload,
        },
      };
    case "UPDATE_POS_ZOOM":
      return {
        ...state,
        position: action.payload.position,
        zoom: action.payload.zoom,
      };
    case "UPDATE_USER_MARKER_INFO": {
      return {
        ...state,
        marker: action.payload,
      };
    }
    case "ERROR":
      return {
        ...state,
        error: action.payload?.error ?? "something went wrong",
      };
    default:
      return state;
  }
}
