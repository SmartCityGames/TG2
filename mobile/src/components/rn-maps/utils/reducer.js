import { logger } from "../../../utils/logger";

export const mapInitialState = {
  showDistricts: false,
  showQuests: false,
  districts: [],
  quests: [],
  combined: [],
};

export function mapReducer(state, action) {
  logger.info(`[MAP] action of type ${action.type} fired`);

  switch (action.type) {
    case "UPDATE_SHOW_QUESTS": {
      const showQuests = action.payload.toggle
        ? !state.showQuests
        : state.showQuests;
      const quests = showQuests ? action.payload.shapes : [];

      return {
        ...state,
        showQuests,
        quests,
      };
    }
    case "TOGGLE_DISTRICTS": {
      const showDistricts = !state.showDistricts;
      const districts = showDistricts ? action.payload : [];

      return {
        ...state,
        showDistricts,
        districts,
      };
    }
    default:
      return state;
  }
}
