import { logger } from "../../utils/logger";

export function userProfileReducer(state, action) {
  logger.info(`[PROFILE] action of type ${action.type} fired`);

  switch (action.type) {
    case "UPDATE_PROFILE":
      return {
        ...state,
        ...action.payload,
        avatar_url: action.payload.avatar_url,
      };
    default:
      return state;
  }
}
