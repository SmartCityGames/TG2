import MetamaskProvider from "./context/metamask/metamask";
import Home from "./pages/Home";

export default function App() {
  return (
    <MetamaskProvider>
      <Home />
    </MetamaskProvider>
  );
}
