import BigNumber from 'bignumber.js'
import { SECONDS_IN_YEAR } from 'config'
import { TOTAL_CAKE_RATE_PRECISION } from './pendingCake'

export const calcPendingRewardApt = (
  cakePerSecond: number,
  aptPrice: BigNumber,
  aptIncentiveInfo: number,
  tvlUSD: BigNumber,
) => {
  const aptPerSecond = new BigNumber(cakePerSecond).times(aptIncentiveInfo).div(TOTAL_CAKE_RATE_PRECISION)
  const aptRewardOneYearUSD = new BigNumber(aptPerSecond).times(aptPrice).times(SECONDS_IN_YEAR)
  const aptApr = aptRewardOneYearUSD.div(tvlUSD)
  return aptApr.toNumber()
}
