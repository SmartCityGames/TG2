import { logger } from "../../utils/logger";

export async function getAllChangesOfUser({
  user,
  quest_created_at,
  quest_expiration,
}) {
  logger.info("[OSM] action of type LOAD_USER_CHANGES fired");

  const { changesets } = await fetch(
    `https://api.openstreetmap.org/api/0.6/changesets.json?display_name=${user}${
      quest_expiration ? `&time=${quest_created_at},${quest_expiration}` : ""
    }`
  ).then((response) => response.json());

  const result = [];
  const map = new Map();
  for (const item of changesets) {
    if (!map.has(item.id)) {
      map.set(item.id, true);
      result.push(item);
    }
  }

  return result;
}
