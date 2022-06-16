import { Dispatch } from "react";
import { UserAuthAction } from "./reducer";

async function fetchUser(
  email: string,
  password: string,
  dispatch: Dispatch<UserAuthAction>
) {
  const { data, status } = await Promise.resolve({
    status: 200,
    data: {
      wallet: `${email}:${password}`,
    } as any,
  });

  if (status !== 200) {
    dispatch({
      type: "ERROR",
      error: data.message,
    });
    return;
  }

  dispatch({
    type: "LOGIN",
    payload: data,
  });
}
