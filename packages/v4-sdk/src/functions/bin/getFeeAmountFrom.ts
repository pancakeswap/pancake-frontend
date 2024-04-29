import { PRECISION } from '../../constants/binPool'

/**
 * Calculates the fee amount from the amount with fees, rounding up
 *
 * @param amountWithFees the amount with fees
 * @param feeBips fee in bips
 * @returns fee amount
 */
export const getFeeAmountFrom = (amountWithFees: bigint, feeBips: bigint): bigint => {
  const totalFee = feeBips * BigInt(1e12)

  return (amountWithFees * totalFee + PRECISION - 1n) / PRECISION
}
