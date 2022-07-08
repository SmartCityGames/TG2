import { Center } from "native-base";
import { ActivityIndicator } from "react-native";
import { useUserAuth } from "../../store/auth/provider";
import AuthStack from "./auth-stack";
import LoggedTabs from "./logged-tabs";

export default function Navigator() {
  const {
    state: { session, loading },
  } = useUserAuth();

  if (loading) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" />
      </Center>
    );
  }

  return session ? <LoggedTabs /> : <AuthStack />;
}
