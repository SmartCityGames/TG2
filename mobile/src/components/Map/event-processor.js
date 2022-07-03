import { Alert } from "react-native";
import { mapConfig } from "./config";

export function processLeafletEvent(event, dispatch) {
  console.log("incoming event:", JSON.stringify(event, null, 2));

  switch (event.tag) {
    case "onMapMarkerClicked":
      Alert.alert(`Map Marker Touched, ID: ${event.mapMarkerId || "unknown"}`);
      break;
    case "onMapClicked":
      Alert.alert(
        `Map Touched at:`,
        `${event.location.lat}, ${event.location.lng}`
      );
      break;
    case "onMoveEnd":
      dispatch({
        type: "UPDATE_POS_ZOOM",
        payload: {
          position: event.mapCenter,
          zoom: Math.min(event.zoom, mapConfig.maxZoom),
        },
      });
      break;
    default:
      if (["onMove"].includes(event.tag)) {
        return;
      }
  }
}
