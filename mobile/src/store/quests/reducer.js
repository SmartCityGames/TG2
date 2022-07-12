import { logger } from "../../utils/logger";

export function questsReducer(state, action) {
  logger.info(`[QUEST] action of type ${action.type} fired`);

  switch (action.type) {
    case "COMPLETE_QUEST":
      return {
        ...state,
        availableQuests: state.availableQuests.filter(
          (q) => q.id !== action.payload
        ),
        loading: false,
        error: undefined,
      };
    case "RETRIEVE_QUESTS":
      return {
        ...state,
        availableQuests: action.payload,
        loading: false,
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
