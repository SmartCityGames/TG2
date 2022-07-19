import { Center } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeafletMap from "../../components/map";
import { useUserLocation } from "../../store/location/provider";
import { useQuests } from "../../store/quests/provider";
import { generateColours } from "../../utils/generate-colours";

export default function HomeScreen() {
  const [polygons, setPolygons] = useState([]);
  const [questShapes, setQuestShapes] = useState([]);
  const [questMarkers, setQuestMarkers] = useState([]);

  const {
    state: { loadingLoc, geojson },
  } = useUserLocation();
  const {
    state: { loadingQuests, availableQuests },
  } = useQuests();

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

  useEffect(() => {
    setQuestMarkers(
      availableQuests?.map((q) => ({
        id: `quest:${q.id}`,
        icon: "🔥",
        position: q.shape.center,
        size: [10, 10],
      })) ?? []
    );

    setQuestShapes(availableQuests?.map((q) => q.shape) ?? []);
  }, [availableQuests]);

  if (loadingLoc || loadingQuests) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" />
      </Center>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <LeafletMap
        polygons={polygons}
        quests={{ markers: questMarkers, shapes: questShapes }}
      />
    </SafeAreaView>
  );
}
