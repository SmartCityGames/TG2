export function userAuthReducer(state, action) {
  switch (action.type) {
    case "SIGNIN":
      return {
        ...state,
        user: action.payload,
      };
    case "ERROR":
      return {
        ...state,
        error: action.payload?.error ?? "something went wrong",
      };
    default:
      return state;
  }
}
