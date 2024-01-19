import BigNumber from 'bignumber.js'
import { SECONDS_IN_YEAR } from 'config'

export const calcPendingRewardApt = (
  poolWeight: BigNumber,
  cakePerSecond: number,
  aptPrice: BigNumber,
  aptIncentiveInfo: number,
  tvlUSD: BigNumber,
) => {
  const yearlyAptRewardAllocation = new BigNumber(cakePerSecond / 100000000)
    .div(100)
    .times(new BigNumber(poolWeight).times(100))
  const aptPerSecond = new BigNumber(yearlyAptRewardAllocation).times(new BigNumber(aptIncentiveInfo).div(100000))
  const aptRewardPerYear = aptPerSecond.times(SECONDS_IN_YEAR)
  const aptAPR = aptRewardPerYear.times(aptPrice).div(tvlUSD).times(100)
  return aptAPR.toNumber()
}
