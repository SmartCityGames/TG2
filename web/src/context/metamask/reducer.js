export function metamaskReducer(state, action) {
  switch (action.type) {
    case "LOAD_PROVIDER": {
      return {
        ...state,
        provider: action.payload,
      };
    }
    case "LOGIN": {
      return {
        ...state,
        account: action.payload,
      };
    }
    default:
      return state;
  }
}
