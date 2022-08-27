import { Route, Routes } from "react-router-dom";
import { useUserAuth } from "../store/auth/provider";
import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import MetamaskProvider from "../store/metamask/metamask";
import Profile from "../pages/Profile";
import Layout from "./Layout";
import UserProfileProvider from "../store/profile/provider";

export default function Router() {
  const {
    state: { session },
  } = useUserAuth();

  return session ? (
    <UserProfileProvider>
      <MetamaskProvider>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/me"
            element={
              <Layout>
                <Profile />
              </Layout>
            }
          />
        </Routes>
      </MetamaskProvider>
    </UserProfileProvider>
  ) : (
    <Routes>
      <Route path="/" element={<SignIn />} />
    </Routes>
  );
}
