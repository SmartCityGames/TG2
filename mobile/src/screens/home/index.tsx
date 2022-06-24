import { useEffect } from "react";
import LeafletMap from "../../components/Map";
import { useUserAuth } from "../../store/auth/provider";
import { useUserLocation } from "../../store/location/provider";

export default function HomeScreen() {
  const {
    state: { marker },
    dispatch: locationDispatch,
  } = useUserLocation();
  const { state: authState } = useUserAuth();

  useEffect(() => {
    locationDispatch({
      type: "UPDATE_USER_MARKER_INFO",
      payload: {
        marker: {
          ...marker,
          id: authState.user!.email!,
        },
      },
    });
  }, []);

  return <LeafletMap />;
}
