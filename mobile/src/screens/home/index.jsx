import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LoadingInterceptor from "../../components/loading/loading-interceptor";
import RnMaps from "../../components/rn-maps";
import { useIndicators } from "../../store/indicators/provider";
import { INDICATORS_LABELS } from "../../store/indicators/utils/indicators-labels";
import { useUserLocation } from "../../store/location/provider";
import { useQuests } from "../../store/quests/provider";
import { sanitizeText } from "../../utils/sanitize-text";
import { generateGreenRedGradientColors } from "./util/generate-districts-colors";
import { generateQuestCircleColor } from "./util/generate-quest-circle-color";

export default function HomeScreen() {
  const [polygons, setPolygons] = useState(null);
  const [questShapes, setQuestShapes] = useState(null);
  const [questMarkers, setQuestMarkers] = useState(null);

  const { isConnected } = useNetInfo();
  const {
    state: { geojson },
  } = useUserLocation();
  const {
    state: { availableQuests },
  } = useQuests();
  const {
    state: { indicators, selectedIndicator },
  } = useIndicators();

  useEffect(() => {
    if (!geojson || !isConnected || !indicators) return;

    const parsedShapes = geojson.features.map((f) => ({
      id: `geojson_${f.properties.CD_SUBDIST}_${f.properties.NM_SUBDIST}`,
      indicators: indicators?.filter((i) =>
        sanitizeText(i.udh)
          .toLowerCase()
          .includes(sanitizeText(f.properties.NM_SUBDIST).toLowerCase())
      )[0],
      features: [f],
    }));

    const showNormal = ["espvida", "renda_per_capita", "prosp_soc"].includes(
      selectedIndicator
    );

    setPolygons(
      parsedShapes.map((shape, _i) => ({
        ...shape,
        color: generateGreenRedGradientColors({
          percentage:
            shape.indicators[
              `${selectedIndicator}${showNormal ? "_normal" : ""}`
            ],
          maxHue: 120 * +(INDICATORS_LABELS[selectedIndicator].order === "RG"),
          minHue: 120 * +(INDICATORS_LABELS[selectedIndicator].order !== "RG"),
        }),
      }))
    );
  }, [geojson, isConnected, indicators, selectedIndicator]);

  useEffect(() => {
    if (!availableQuests || !isConnected) return;

    setQuestMarkers(
      availableQuests?.map((q) => ({
        id: `quest-${q.id}`,
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

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <LoadingInterceptor
        extra={[!polygons?.length, !questMarkers, !questShapes]}
      >
        <RnMaps
          polygons={polygons}
          quests={{ markers: questMarkers, shapes: questShapes }}
        />
      </LoadingInterceptor>
    </SafeAreaView>
  );
}
