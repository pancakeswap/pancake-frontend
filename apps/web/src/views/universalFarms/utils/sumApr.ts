export const sumApr = (...aprs: Array<number | `${number}` | undefined>): number => {
  const sum = aprs.reduce((acc, apr) => {
    if (typeof apr === 'undefined') {
      return acc ?? 0
    }
    return Number(acc ?? 0) + Number(apr ?? 0)
  }, 0)
  return Number(sum) ? Number(sum) : 0
}
