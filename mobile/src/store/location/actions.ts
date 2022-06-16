import {
  getLastKnownPositionAsync,
  LocationObject,
  PermissionStatus,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from "expo-location";
import { Dispatch } from "react";
import { UserLocationAction } from "./reducer";

const locationObjectToLiteral = (loc: LocationObject) => ({
  lat: loc.coords.latitude,
  lng: loc.coords.longitude,
});

export async function requestUserLocation(
  dispatch: Dispatch<UserLocationAction>
) {
  const { status } = await requestForegroundPermissionsAsync();

  if (status === PermissionStatus.GRANTED) return;

  dispatch({
    type: "ERROR",
    error: "user should grant location permissions",
  });
}

export async function watchUserPosition(
  dispatch: Dispatch<UserLocationAction>
) {
  return watchPositionAsync({ accuracy: 0.7 }, (loc) => {
    dispatch({
      type: "UPDATE_POS",
      payload: {
        position: locationObjectToLiteral(loc),
      },
    });
  });
}

export async function getUserPosition(dispatch: Dispatch<UserLocationAction>) {
  console.log("fetching last know user position")
  const loc = await getLastKnownPositionAsync();

  if (!loc) return;

  dispatch({
    type: "FIND_ME",
    payload: {
      position: locationObjectToLiteral(loc),
      zoom: 17,
    },
  });
}
