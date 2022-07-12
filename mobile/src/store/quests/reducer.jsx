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
      };
    default:
      return state;
  }
}
