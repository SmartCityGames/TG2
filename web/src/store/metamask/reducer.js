export function metamaskReducer(state, action) {
  console.log(`[METAMASK] action of type ${action.type} fired`);

  switch (action.type) {
    case "LOAD_PROVIDER": {
      const { provider, contracts } = action.payload;

      return {
        ...state,
        provider,
        contracts,
        signer: provider.getSigner(),
        loading: false,
        error: undefined,
      };
    }
    case "UPDATE_CONTRACT_VALUES":
      return {
        ...state,
        values: {
          ...action.payload,
        },
      };
    case "LOGIN": {
      return state.account === action.payload
        ? state
        : {
            ...state,
            account: action.payload,
            loading: false,
            error: undefined,
          };
    }
    case "ERROR": {
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    }
    case "LOADING": {
      return {
        ...state,
        loading: !state.loading,
      };
    }
    default:
      return state;
  }
}
