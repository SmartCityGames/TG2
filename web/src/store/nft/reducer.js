export function nftReducer(state, action) {
  console.log(`[NFT] action of type ${action.type} fired`);

  switch (action.type) {
    case "LOAD_NFTS":
      return {
        ...state,
        nfts: action.payload,
      };
    default:
      return state;
  }
}
