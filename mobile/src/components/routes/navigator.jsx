import { useUserAuth } from "../../store/auth/provider";
import { CenterLoading } from "../loading/center-loading";
import AuthStack from "./auth-stack";
import LoggedTabs from "./logged-tabs";

export default function Navigator() {
  const {
    state: { session, loading },
  } = useUserAuth();

  if (loading) {
    return <CenterLoading />;
  }

  return session ? <LoggedTabs /> : <AuthStack />;
}
