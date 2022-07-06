import { useEffect } from "react";
import LeafletMap from "../../components/Map";
import { useUserLocation } from "../../store/location/provider";

export default function HomeScreen() {
  const {
    state: { error },
    actions: { requestUserLocation },
  } = useUserLocation();

  useEffect(() => {
    requestUserLocation();
  }, []);

  return error ? <Text>{error.message}</Text> : <LeafletMap />;
}
