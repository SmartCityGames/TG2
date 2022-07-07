import { Center } from "native-base";
import { useEffect } from "react";
import { ActivityIndicator, Linking } from "react-native";
import LeafletMap from "../../components/Map";
import AsyncAlert from "../../components/utils/AsyncAlert";
import { useUserLocation } from "../../store/location/provider";

export default function HomeScreen() {
  const {
    state: { granted, error, loading },
    actions: { requestUserLocation },
  } = useUserLocation();

  useEffect(() => {
    if (loading) return;

    async function setupPermission() {
      await AsyncAlert(
        error?.message ?? "ops",
        "go to settings and grant permission"
      );
      await Linking.openSettings();
      await requestUserLocation();
    }

    if (!granted) {
      setupPermission();
    }
  }, [loading, granted]);

  if (loading || !granted) {
    return (
      <Center flex={1}>
        <ActivityIndicator />
      </Center>
    );
  }

  return <LeafletMap />;
}
