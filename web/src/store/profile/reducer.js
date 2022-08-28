export function profileReducer(state, action) {
  console.log(`[PROFILE] action of type ${action.type} fired`);

  switch (action.type) {
    case "UPDATE_PROFILE":
    case "GET_PROFILE":
      return {
        ...state,
        ...action.payload,
        loading: false,
        error: undefined,
      };
    case "LOADING":
      return {
        ...state,
        loading: !state.loading,
      };
    case "ERROR":
      return {
        ...state,
        error: action.payload.error,
      };
    default:
      return state;
  }
}
