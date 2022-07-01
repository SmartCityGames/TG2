import { Route, Routes } from "react-router-dom";
import { useUserAuth } from "../store/auth/provider";
import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import MetamaskProvider from "../store/metamask/metamask";

export default function Router() {
  const {
    state: { session },
  } = useUserAuth();

  return session ? (
    <MetamaskProvider>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </MetamaskProvider>
  ) : (
    <Routes>
      <Route path="/" element={<SignIn />} />
    </Routes>
  );
}
