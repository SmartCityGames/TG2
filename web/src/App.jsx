import Router from "./components/router";
import UserAuthProvider from "./store/auth/provider";

export default function App() {
  return (
    <UserAuthProvider>
      <Router />
    </UserAuthProvider>
  );
}
