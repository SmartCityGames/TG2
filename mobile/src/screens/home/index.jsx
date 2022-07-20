import { Center } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeafletMap from "../../components/map";
import { useUserLocation } from "../../store/location/provider";
import { useQuests } from "../../store/quests/provider";
import { generateDistrictsColors } from "./util/generate-districts-colors";
import { generateQuestCircleColor } from "./util/generate-quest-circle-color";
import { generateQuestEmoji } from "./util/generate-quest-emoji";

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
      properties: {
        ...f.properties,
        type: "subdistrict",
      },
      positions: f.geometry.coordinates[0].map(([lng, lat]) => ({
        lng,
        lat,
      })),
    }));

    const colors = generateDistrictsColors({
      quantity: parsedShapes.length,
      shuffle: true,
      offset: 45,
    });

    setPolygons(
      parsedShapes.map((shape) => ({ ...shape, color: colors[shape.id] }))
    );
  }, [geojson]);

  useEffect(() => {
    if (!availableQuests) return;

    setQuestMarkers(
      availableQuests.map((q) => ({
        id: q.id,
        icon: generateQuestEmoji(q),
        position: q.shape.center,
        size: [15, 15],
      }))
    );

    setQuestShapes(
      availableQuests.map((q) => ({
        ...q.shape,
        color: generateQuestCircleColor(q),
        properties: {
          type: "quest",
        },
      }))
    );
  }, [availableQuests]);

  const allDataReady = [
    !loadingLoc,
    !loadingQuests,
    polygons.length,
    questMarkers.length,
    questShapes.length,
  ].every((v) => v);

  if (!allDataReady) {
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
