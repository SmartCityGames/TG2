import { UserAuthState } from "./user";

export interface UserAuthAction {
  type: "LOGIN" | "ERROR" | "SIGNIN" | "SIGNUP";
  payload?: Partial<UserAuthState>;
  error?: string;
}

export function userAuthReducer(
  state: UserAuthState,
  action: UserAuthAction
): UserAuthState {
  switch (action.type) {
    case "SIGNIN":
      return {
        ...state,
        user: action.payload?.user
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
