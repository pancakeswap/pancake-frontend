/**
 * given amount and protocolFee, calculate and return external protocol fee amt
 */
export const getExternalFeeAmt = (amounts: [bigint, bigint], fee: bigint): [bigint, bigint] => {
  if (fee === 0n) {
    return [0n, 0n]
  }

  const fee0 = fee % 256n
  const fee1 = fee >> 8n

  const fee0Amt = fee0 === 0n ? 0n : amounts[0] / fee0
  const fee1Amt = fee1 === 0n ? 0n : amounts[1] / fee1

  return [fee0Amt, fee1Amt]
}
