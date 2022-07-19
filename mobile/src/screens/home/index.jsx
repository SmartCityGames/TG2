import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LeafletMap from "../../components/map";
import { useUserLocation } from "../../store/location/provider";
import { generateColours } from "../../utils/generate-colours";

export default function HomeScreen() {
  const [polygons, setPolygons] = useState([]);
  const {
    state: { geojson },
  } = useUserLocation();

  useEffect(() => {
    if (!geojson) return;

    const parsedShapes = geojson.features.map((f, i) => ({
      id: i,
      shapeType: "polygon",
      positions: f.geometry.coordinates[0].map(([lng, lat]) => ({
        lng,
        lat,
      })),
    }));

    const colors = generateColours({
      quantity: parsedShapes.length,
      shuffle: true,
      offset: 45,
    });

    setPolygons(
      parsedShapes.map((shape) => ({ ...shape, color: colors[shape.id] }))
    );
  }, [geojson]);

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <LeafletMap polygons={polygons} />
    </SafeAreaView>
  );
}
