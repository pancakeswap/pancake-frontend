/**
 * Returns the price of bin given its id and the bin step
 */
export const getIdFromPrice = (price: number, binStep: number): number => {
  return Math.trunc(Math.log(price) / Math.log(1 + binStep / 10000)) + 2 ** 23
}
