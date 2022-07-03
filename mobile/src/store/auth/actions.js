import AsyncAlert from "../../components/utils/AsyncAlert";
import { supabase } from "../supabase";

export async function login(dispatch, { email, password }) {
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
  };

  dispatch({
    type: "SIGNIN",
    payload: user,
  });
}

export async function signup(dispatch, { email, password, navigation }) {
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    await showAuthError(dispatch, error);
    return;
  }

  await AsyncAlert("Email Confirm", "Please confirm your email!");

  navigation.navigate("SignIn");
}

export async function showAuthError(dispatch, error) {
  await AsyncAlert(`Status: ${error.status}`, `Error: ${error.message}`);
  dispatch({
    type: "SIGNUP",
    payload: {
      error: error?.message,
    },
  });
}
