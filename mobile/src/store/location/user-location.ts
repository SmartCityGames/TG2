import { MapMarker } from "expo-leaflet";
import { LatLngLiteral } from "leaflet";

export interface UserLocationState {
  position: LatLngLiteral | null;
  marker: MapMarker;
  zoom: number;
  error: string | null;
}
