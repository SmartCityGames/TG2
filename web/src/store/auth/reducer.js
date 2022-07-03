import { authInitialState } from "./provider";

export function authReducer(state, action) {
  console.log(`[AUTH] action of type ${action.type} fired`);

  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        session: action.payload,
        loading: false,
        error: undefined,
      };
    case "ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "LOADING":
      return {
        ...state,
        loading: !state.loading,
      };
    case "LOGOUT":
      return authInitialState;
    default:
      return state;
  }
}
