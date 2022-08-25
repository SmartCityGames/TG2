import { isBefore } from "date-fns";
import { logger } from "../utils/logger";

export async function getAllChangesOfUser({ user }) {
  logger.info("[OSM] action of type LOAD_CHANGES_USER fired");

  const { elements } = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: `[out:json];node(user: "${user}");out meta;`,
  }).then((response) => response.json());

  const result = [];
  const map = new Map();
  for (const item of elements) {
    if (!map.has(item.changeset)) {
      map.set(item.changeset, true);
      result.push(item);
    }
  }

  return result.sort((a, b) =>
    isBefore(new Date(a.timestamp), new Date(b.timestamp))
  );
}
