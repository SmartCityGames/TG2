export function shortenAccount(account) {
  return `${account.slice(0, 5)}...${account.slice(-4)}`.toUpperCase();
}
