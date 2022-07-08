import { useUserAuth } from "../../store/auth/provider";
import AuthStack from "./auth-stack";
import LoggedTabs from "./logged-tabs";

export default function Navigator() {
  const {
    state: { session },
  } = useUserAuth();

  return session ? <LoggedTabs /> : <AuthStack />;
}
