import Router from "./components/Router";
import UserAuthProvider from "./store/auth/provider";

export default function App() {
  return (
    <UserAuthProvider>
      <Router />
    </UserAuthProvider>
  );
}
