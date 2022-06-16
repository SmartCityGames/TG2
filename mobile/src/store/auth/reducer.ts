import { UserAuthState } from "./user";

export interface UserAuthAction {
  type: "LOGIN" | "ERROR";
  payload?: Partial<UserAuthState>;
  error?: string;
}

export function userAuthReducer(
  state: UserAuthState,
  action: UserAuthAction
): UserAuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        ...action.payload,
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
