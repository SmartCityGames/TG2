import { Dispatch } from "react";
import { UserAuthAction } from "./reducer";
import { supabase } from "../supabase";
import { User } from "./user";
import { ApiError } from "@supabase/supabase-js";
import AsyncAlert from "../../components/utils/AsyncAlert";

export async function login(
  dispatch: Dispatch<UserAuthAction>,
  { email, password }: any
) {
  const { user: supaUser, error } = await supabase.auth.signIn({
    email: email,
    password: password,
  });

  if (error) {
    await showAuthError(dispatch, error);
    return;
  }

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
      user,
    },
  });
}

export async function signup(
  dispatch: Dispatch<UserAuthAction>,
  { email, password, navigation }: any
) {
  const { user: supaUser, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    await showAuthError(dispatch, error);
    return;
  }

  await AsyncAlert("Email Confirm", "Please confirm your email!");

  navigation.navigate('SignIn');

}

export async function showAuthError(dispatch: Dispatch<UserAuthAction>, error: ApiError) {
  await AsyncAlert(`Status: ${error.status}`, `Error: ${error.message}`);
  dispatch({
    type: "SIGNUP",
    payload: {
      error: error?.message,
    },
  });
}
