import { PRECISION } from '../../constants/binPool'

/**
 * Calculates the fee amount that will be charged, rounding up
 *
 * @param amount The amount
 * @param feeBips fee in bips
 */
export const getFeeAmount = (amount: bigint, feeBips: bigint): bigint => {
  const totalFee = feeBips * BigInt(1e12)
  const denominator = PRECISION - totalFee

  return (amount * totalFee + denominator - 1n) / denominator
}
