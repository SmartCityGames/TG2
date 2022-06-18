export async function getAccount(dispatch, provider) {
  const [account] = await provider.send("eth_requestAccounts", []);
  dispatch({
    type: "LOGIN",
    payload: account,
  });
}
