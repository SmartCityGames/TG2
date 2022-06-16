import { UserLocationState } from "./user-location";

export interface UserLocationAction {
  type: "UPDATE_POS" | "UPDATE_ZOOM" | "FIND_ME" | "ERROR";
  payload?: Partial<UserLocationState>;
  error?: string;
}

export function userLocationReducer(
  state: UserLocationState,
  action: UserLocationAction
): UserLocationState {
  switch (action.type) {
    case "UPDATE_POS":
      return {
        ...state,
        ...action.payload,
        marker: {
          ...state.marker,
          position: action.payload?.position!,
        },
      };
    case "UPDATE_ZOOM":
      return {
        ...state,
        ...action.payload,
      };
    case "FIND_ME":
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
