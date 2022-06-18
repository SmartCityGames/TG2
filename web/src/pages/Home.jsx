import { getAccount } from "../context/metamask/actions";
import { useMetamask } from "../context/metamask/metamask";
import { shortenAccount } from "../utils/short-account";

export default function Home() {
  const { state, dispatch } = useMetamask();

  return (
    <div className="bg-slate-800 min-h-screen flex justify-center">
      <div className="flex flex-col items-center justify-center space-y-4">
        {state.account && (
          <h1 className="text-xl text-teal-600">
            Account: {shortenAccount(state.account)}
          </h1>
        )}
        {!state.account && (
          <button
            className="p-3 bg-red-400 rounded-lg"
            onClick={() => getAccount(dispatch, state.provider)}
          >
            login with Metamask
          </button>
        )}
      </div>
    </div>
  );
}
