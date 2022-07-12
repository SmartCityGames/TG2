import { SafeAreaView } from "react-native-safe-area-context";
import LeafletMap from "../../components/map";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <LeafletMap />
    </SafeAreaView>
  );
}
