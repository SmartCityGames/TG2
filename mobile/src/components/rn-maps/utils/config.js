import { Platform } from "react-native";

export const mapConfig = {
  mapLayers: [
    {
      attribution:
        '<div>&copy <a href="/copyright">contribuidores do OpenStreetMap</a> ♥ <a class="donate-attr" href="https://donate.openstreetmap.org">Fazer uma doação</a>. <a href="https://wiki.osmfoundation.org/wiki/Terms_of_Use" target="_blank">Termos do site e da API</a></div>',
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
    doubleClickZoom: false,
  },
};
