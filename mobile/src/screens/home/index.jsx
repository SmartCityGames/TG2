import { useNetInfo } from "@react-native-community/netinfo";
import { Center } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeafletWebviewMap from "../../components/map/leaflet-webview-map";
import { useUserLocation } from "../../store/location/provider";
import { useQuests } from "../../store/quests/provider";
import { generateDistrictsColors } from "./util/generate-districts-colors";
import { generateQuestCircleColor } from "./util/generate-quest-circle-color";
import { generateQuestEmoji } from "./util/generate-quest-emoji";

export default function HomeScreen() {
  const [polygons, setPolygons] = useState([]);
  const [questShapes, setQuestShapes] = useState([]);
  const [questMarkers, setQuestMarkers] = useState([]);
  const { isConnected } = useNetInfo();

  const {
    state: { loadingLoc, geojson },
  } = useUserLocation();
  const {
    state: { loadingQuests, availableQuests },
  } = useQuests();

  useEffect(() => {
    if (!geojson || !isConnected) return;

    const parsedShapes = geojson.features.map((f, i) => ({
      id: i,
      shapeType: "Polygon",
      properties: f.properties,
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
  }, [geojson, isConnected]);

  useEffect(() => {
    if (!availableQuests || !isConnected) return;

    setQuestMarkers(
      availableQuests?.map((q) => ({
        id: `quest-${q.id}`,
        icon: generateQuestEmoji(q),
        position: q.shape.center,
        size: [15, 15],
      })) ?? []
    );

    setQuestShapes(
      availableQuests?.map((q) => ({
        ...q.shape,
        color: generateQuestCircleColor(q),
      })) ?? []
    );
  }, [availableQuests, isConnected]);

  const allDataReady = [
    !loadingLoc,
    !loadingQuests,
    polygons.length,
    questShapes,
    questMarkers,
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
      <LeafletWebviewMap
        polygons={polygons}
        quests={{ markers: questMarkers, shapes: questShapes }}
      />
    </SafeAreaView>
  );
}
