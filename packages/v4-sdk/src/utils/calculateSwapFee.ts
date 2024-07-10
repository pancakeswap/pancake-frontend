/**
 * protocol fee charged first, then LP fee charged remaining
 * @param protocolFee
 * @param lpFee
 *
 * @returns swapFee bigint
 *  unit: bps/100
 *  1 = 0.0001%
 */
export const calculateSwapFee = (protocolFee: bigint, lpFee: bigint): bigint => {
  return protocolFee + lpFee - (protocolFee * lpFee) / 1_000_000n
}
