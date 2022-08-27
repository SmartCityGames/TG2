export function profileReducer(state, action) {
  console.log(`[PROFILE] action of type ${action.type} fired`);

  switch (action.type) {
    case "GET_PROFILE":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
