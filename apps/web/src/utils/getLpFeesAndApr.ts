import { TOTAL_FEE, LP_HOLDERS_FEE, LP_HOLDERS_FEE_STABLE_AND_LP, WEEKS_IN_YEAR } from '../config/constants/info'

export const getLpFeesAndApr = (volumeUSD: number, volumeUSDWeek: number, liquidityUSD: number, address: string) => {
  const totalFees24h = volumeUSD * TOTAL_FEE
  const totalFees7d = volumeUSDWeek * TOTAL_FEE
  const lpHolderFee = LP_HOLDERS_FEE_STABLE_AND_LP[address.toLowerCase()] ?? LP_HOLDERS_FEE
  const lpFees24h = volumeUSD * lpHolderFee
  const lpFees7d = volumeUSDWeek * lpHolderFee
  const lpApr7d = liquidityUSD > 0 ? (volumeUSDWeek * lpHolderFee * WEEKS_IN_YEAR * 100) / liquidityUSD : 0
  return {
    totalFees24h,
    totalFees7d,
    lpFees24h,
    lpFees7d,
    lpApr7d: lpApr7d !== Infinity ? lpApr7d : 0,
  }
}
