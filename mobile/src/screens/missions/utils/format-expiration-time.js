import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
} from "date-fns";

export function formatTimeLeft(expires_at) {
  const now = new Date();
  const expiration = new Date(expires_at);

  let time = differenceInDays(expiration, now);

  if (!time) {
    time = differenceInHours(expiration, now);
    if (!time) {
      time = differenceInMinutes(expiration, now);
      if (!time) {
        time = differenceInSeconds(expiration, now);
        return `${time} seconds left`;
      }
      return `${time} minutes left`;
    }
    return `${time} hours left`;
  }
  return `${time} days left`;
}
