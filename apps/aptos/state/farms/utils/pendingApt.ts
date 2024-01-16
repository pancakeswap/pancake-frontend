import BigNumber from 'bignumber.js'
import { SECONDS_IN_YEAR } from 'config'
import { TOTAL_CAKE_RATE_PRECISION } from './pendingCake'

const GLOBAL_APT_INCENTIVE_RATE = 10000

export const calcPendingRewardApt = (cakePerSecond, aptPrice, tvlUSD) => {
  const aptPerSecond = new BigNumber(cakePerSecond).times(GLOBAL_APT_INCENTIVE_RATE).div(TOTAL_CAKE_RATE_PRECISION)
  const aptRewardOneYearUSD = new BigNumber(aptPerSecond).times(aptPrice).times(SECONDS_IN_YEAR)
  const aptApr = aptRewardOneYearUSD.div(tvlUSD)
  return aptApr.toNumber()
}
