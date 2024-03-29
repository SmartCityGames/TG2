import { Route, Routes } from "react-router-dom";
import { useMetamask } from "../../store/metamask/provider";
import Home from "../../pages/Home";
import Profile from "../../pages/Profile";
import Layout from "../layout";
import InstallMEtamask from "../InstallMetamask";

export default function LoggedRoutes() {
  const {
    state: { error },
  } = useMetamask();

  if (error?.code === "NO_METAMASK") {
    return <InstallMEtamask />;
  }

  return (
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
  );
}
