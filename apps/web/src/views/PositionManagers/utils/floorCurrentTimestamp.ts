// used for flooring current timestamps to for vault history api snapshot api
export const floorToUTC00 = (timestamp: number): number => {
  const date = new Date(timestamp)
  date.setUTCHours(0, 0, 0, 0)
  return date.getTime()
}
