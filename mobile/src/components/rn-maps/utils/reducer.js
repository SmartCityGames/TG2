import { logger } from "../../../utils/logger";

export const mapInitialState = {
  showDistricts: false,
  showQuests: false,
};

export function mapReducer(state, action) {
  logger.info(`[MAP] action of type ${action.type} fired`);

  switch (action.type) {
    case "UPDATE_SHOW_QUESTS": {
      const showQuests = action.payload.toggle
        ? !state.showQuests
        : state.showQuests;

      return {
        ...state,
        showQuests,
      };
    }
    case "TOGGLE_DISTRICTS": {
      return {
        ...state,
        showDistricts: !state.showDistricts,
      };
    }
    default:
      return state;
  }
}
