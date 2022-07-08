import { SafeAreaView } from "react-native-safe-area-context";
import LeafletMap from "../../components/map";

export default function HomeScreen() {
  return (
    <SafeAreaView edges={["left", "right", "top"]} style={{ flex: 1 }}>
      <LeafletMap />
    </SafeAreaView>
  );
}
