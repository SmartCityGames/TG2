import { ethers } from "ethers";
// import HelloWorldContractJSON from "../../../../blockchain/build/contracts/HelloWorld.json";
import SmartCityGamesContractJSON from "../../../../blockchain/artifacts/contracts/SmartCityGames.sol/SmartCityGames.json";
import { config } from "../../config";

export function metamaskReducer(state, action) {
  console.log(`[METAMASK] action of type ${action.type} fired`);

  switch (action.type) {
    case "LOAD_PROVIDER": {
      const provider = action.payload;
      return {
        ...state,
        provider,
        signer: provider.getSigner(),
        contracts: {
          // hello: new ethers.Contract(
          //   config.CONTRACT_HEX,
          //   HelloWorldContractJSON.abi,
          //   provider
          // ),
          smartCityGames: new ethers.Contract(
            config.CONTRACT_HEX,
            SmartCityGamesContractJSON.abi,
            provider),
        },
        loading: false,
        error: undefined,
      };
    }
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
