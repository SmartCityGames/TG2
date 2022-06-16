import LeafletMap from "../../components/Map";
import UserAuthProvider from "../../store/auth/provider";
import UserLocationProvider from "../../store/location/provider";

export default function HomeScreen() {
  return (
    <UserAuthProvider>
      <UserLocationProvider>
        <LeafletMap />
      </UserLocationProvider>
    </UserAuthProvider>
  );
}
