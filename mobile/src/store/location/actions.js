import {
  getLastKnownPositionAsync,
  PermissionStatus,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location";

const locationObjectToLiteral = (loc) => ({
  lat: loc.coords.latitude,
  lng: loc.coords.longitude,
});

export async function requestUserLocation(dispatch) {
  const { status } = await requestForegroundPermissionsAsync();

  if (status === PermissionStatus.GRANTED) return;

  dispatch({
    type: "ERROR",
    error: "user should grant location permissions",
  });
}

export async function watchUserPosition(dispatch) {
  return watchPositionAsync({ accuracy: 0.7 }, (loc) => {
    dispatch({
      type: "UPDATE_POS",
      payload: locationObjectToLiteral(loc),
    });
  });
}

export async function getUserPosition(dispatch) {
  console.log("fetching last know user position");
  const loc = await getLastKnownPositionAsync();

  if (!loc) return;

  dispatch({
    type: "UPDATE_POS_ZOOM",
    payload: {
      position: locationObjectToLiteral(loc),
      zoom: 17,
    },
  });
}
