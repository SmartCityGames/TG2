import { ethers } from "ethers";
import HelloWorldContractJSON from "../../../../blockchain/build/contracts/HelloWorld.json";

export function metamaskReducer(state, action) {
  switch (action.type) {
    case "LOAD_PROVIDER": {
      const provider = action.payload;
      return {
        ...state,
        provider,
        signer: provider.getSigner(),
        contracts: {
          hello: new ethers.Contract(
            //! this is the hash os deployed contract (HelloWorld)
            "0x31d3421477ea0a09f45287be3473782392c784f3",
            HelloWorldContractJSON.abi,
            provider
          ),
        },
      };
    }
    case "LOGIN": {
      return state.account === action.payload
        ? state
        : {
            ...state,
            account: action.payload,
          };
    }
    default:
      return state;
  }
}
