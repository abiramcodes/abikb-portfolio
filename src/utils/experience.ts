/** Site copyright year. Defaults to right now. */
export function getSiteYear(now: Date = new Date()): number {
  return now.getFullYear();
}
