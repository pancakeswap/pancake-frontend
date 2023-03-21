import BigNumber from 'bignumber.js'
import { SECONDS_IN_YEAR } from 'config'
import { BIG_TEN } from '@pancakeswap/utils/bigNumber'
import { FARM_DEFAULT_DECIMALS } from 'components/Farms/constants'

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @returns Farm Apr
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  cakePriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  regularCakePerSeconds: number,
): { cakeRewardsApr: number } => {
  const yearlyCakeRewardAllocation = poolWeight
    ? poolWeight.times(SECONDS_IN_YEAR * regularCakePerSeconds)
    : new BigNumber(NaN)
  const cakeRewardsApr = yearlyCakeRewardAllocation.times(cakePriceUsd).div(poolLiquidityUsd).times(100)
  let cakeRewardsAprAsNumber: null | number = null
  if (!cakeRewardsApr.isNaN() && cakeRewardsApr.isFinite()) {
    cakeRewardsAprAsNumber = cakeRewardsApr.div(BIG_TEN.pow(FARM_DEFAULT_DECIMALS)).toNumber()
  }
  return { cakeRewardsApr: cakeRewardsAprAsNumber as number }
}

export default null
