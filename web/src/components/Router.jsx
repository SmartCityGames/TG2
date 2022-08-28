import { Route, Routes } from "react-router-dom";
import SignIn from "../pages/SignIn";
import { useUserAuth } from "../store/auth/provider";
import MetamaskProvider from "../store/metamask/metamask";
import UserProfileProvider from "../store/profile/provider";
import LoggedRoutes from "./routes/LoggedRoutes";

export default function Router() {
  const {
    state: { session },
  } = useUserAuth();

  return session ? (
    <UserProfileProvider>
      <MetamaskProvider>
        <LoggedRoutes />
      </MetamaskProvider>
    </UserProfileProvider>
  ) : (
    <Routes>
      <Route path="/" element={<SignIn />} />
    </Routes>
  );
}
