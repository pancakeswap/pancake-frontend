import { PRECISION } from '../../constants/binPool'

export const getFeeAmountFrom = (amountWithFees: bigint, feeBips: bigint): bigint => {
  const totalFee = feeBips * BigInt(1e12)

  return (amountWithFees * totalFee + PRECISION - 1n) / PRECISION
}
