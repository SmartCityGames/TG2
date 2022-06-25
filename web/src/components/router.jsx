import { Route, Routes } from "react-router-dom";
import { useUserAuth } from "../context/auth/provider";
import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import MetamaskProvider from "../context/metamask/metamask";

export default function Router() {
  const {
    state: { user },
  } = useUserAuth();

  return user ? (
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
