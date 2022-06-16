import { MapLayer } from "expo-leaflet";
import { MapOptions } from "leaflet";
import { Platform } from "react-native";

type MapConfig = {
  mapLayers: MapLayer[];
  mapOptions: MapOptions;
  maxZoom: number;
};

export const mapConfig: MapConfig = {
  mapLayers: [
    {
      attribution:
        '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      baseLayer: true,
      baseLayerIsChecked: true,
      baseLayerName: "OpenStreetMap",
      layerType: "TileLayer",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    },
  ],
  maxZoom: 18,
  mapOptions: {
    attributionControl: false,
    zoomControl: Platform.OS === "web",
    maxZoom: 18,
    minZoom: 5,
    bounceAtZoomLimits: true,
  },
};
