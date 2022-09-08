import { Route, Routes } from "react-router-dom";
import SignIn from "../pages/SignIn";
import { useUserAuth } from "../store/auth/provider";
import MetamaskProvider from "../store/metamask/provider";
import NftProvider from "../store/nft/provider";
import UserProfileProvider from "../store/profile/provider";
import LoggedRoutes from "./routes/LoggedRoutes";

export default function Router() {
  const {
    state: { session },
  } = useUserAuth();

  return session ? (
    <UserProfileProvider>
      <NftProvider>
        <MetamaskProvider>
          <LoggedRoutes />
        </MetamaskProvider>
      </NftProvider>
    </UserProfileProvider>
  ) : (
    <Routes>
      <Route path="/" element={<SignIn />} />
    </Routes>
  );
}
