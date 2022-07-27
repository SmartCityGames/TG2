import { useNetInfo } from "@react-native-community/netinfo";
import { Center } from "native-base";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RnMaps from "../../components/rn-maps";
import { useIndicators } from "../../store/indicators/provider";
import { useUserLocation } from "../../store/location/provider";
import { useQuests } from "../../store/quests/provider";
import { generateGreenRedGradientColors } from "./util/generate-districts-colors";
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
  const {
    state: { ivs },
  } = useIndicators();

  useEffect(() => {
    if (!geojson || !isConnected || !ivs) return;

    const parsedShapes = geojson.features.map((f) => ({
      id: `geojson_${f.properties.CD_SUBDIST}_${f.properties.NM_SUBDIST}`,
      indicators: {
        ivs: ivs?.filter((i) =>
          i.UDH.toLowerCase().includes(f.properties.NM_SUBDIST.toLowerCase())
        ),
      },
      features: [f],
    }));

    setPolygons(
      parsedShapes.map((shape, _i) => ({
        ...shape,
        color: generateGreenRedGradientColors({
          percentage: shape.indicators.ivs[0].IDHM,
          order: "RG",
        }),
      }))
    );
  }, [geojson, isConnected, ivs]);

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
      {/* <LeafletWebviewMap
        polygons={polygons}
        quests={{ markers: questMarkers, shapes: questShapes }}
      /> */}
      <RnMaps
        polygons={polygons}
        quests={{ markers: questMarkers, shapes: questShapes }}
      />
    </SafeAreaView>
  );
}
