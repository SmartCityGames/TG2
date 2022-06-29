import { supabase } from "../supabase";

export async function login(dispatch, { email, password }) {
  console.log({ email, password });

  const { user } = await supabase.auth.signIn({
    email,
    password,
  });

  dispatch({
    type: "LOGIN",
    payload: user,
  });
}
