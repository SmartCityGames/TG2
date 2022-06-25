import { Dispatch } from "react";
import { UserAuthAction } from "./reducer";
import { supabase } from "../supabase";
import { User } from "./user";

export async function login(
  dispatch: Dispatch<UserAuthAction>,
  { email, password }: any
) {
  const { user: supaUser, error } = await supabase.auth.signIn({
    email: email,
    password: password,
  });

  const user = {
    ...supaUser,
    experience: 0,
    ongoingQuests: [],
    availableQuests: [],
    doneQuests: [],
  } as User;

  dispatch({
    type: "SIGNIN",
    payload: {
      error: error?.message,
      user,
    },
  });
}

export async function signup(
  dispatch: Dispatch<UserAuthAction>,
  { email, password }: any
) {
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  dispatch({
    type: "SIGNUP",
    payload: {
      error: error?.message,
    },
  });
}
