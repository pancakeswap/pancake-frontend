/**
 * given amount(totalFeeAmount) and protocolFee, swapFee
 * returns the protocol fee amount
 */
export const getExternalFeeAmt = (
  amounts: [bigint, bigint],
  protocolFees: [bigint, bigint],
  swapFee: bigint
): [bigint, bigint] => {
  if (swapFee === 0n || protocolFees.every((fee) => fee === 0n)) {
    return [0n, 0n]
  }

  const [feeX, feeY] = protocolFees
  const [amountX, amountY] = amounts

  const feeXAmt = feeX === 0n ? 0n : (amountX * feeX) / swapFee
  const feeYAmt = feeY === 0n ? 0n : (amountY * feeY) / swapFee

  return [feeXAmt, feeYAmt]
}
