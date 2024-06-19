import { ChainId } from '@pancakeswap/chains'
import { YEAR_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR } from 'config'
import lpAprs1 from 'config/constants/lpAprs/1.json'
import lpAprs56 from 'config/constants/lpAprs/56.json'

const getLpApr = (chainId?: number) => {
  switch (chainId) {
    case ChainId.BSC:
      return lpAprs56
    case ChainId.ETHEREUM:
      return lpAprs1
    default:
      return {}
  }
}

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number | null,
  rewardTokenPrice: number | null,
  totalStaked: number | null,
  tokenPerBlock: number | null,
): number | null => {
  if (stakingTokenPrice === null || rewardTokenPrice === null || totalStaked === null || tokenPerBlock === null) {
    return null
  }

  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice).times(tokenPerBlock).times(BLOCKS_PER_YEAR)
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(totalStaked)
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber()
}

const BIG_NUMBER_NAN = new BigNumber(NaN)

/**
 * Get farm APR value in %
 * @param chainId
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param farmAddress Farm Address
 * @param regularCakePerBlock
 * @returns Farm Apr
 */
export const getFarmApr = (
  chainId: number | undefined,
  poolWeight: BigNumber | null | undefined,
  cakePriceUsd: BigNumber | null,
  poolLiquidityUsd: BigNumber | null | undefined,
  farmAddress: string | null,
  regularCakePerBlock: number,
  lpRewardsApr?: number,
  cakePerSecFromBCake?: number,
): { cakeRewardsApr: number | null; lpRewardsApr: number } => {
  const yearlyCakeRewardAllocation = cakePerSecFromBCake
    ? new BigNumber(cakePerSecFromBCake).times(YEAR_IN_SECONDS)
    : poolWeight
    ? poolWeight.times(BLOCKS_PER_YEAR * regularCakePerBlock)
    : new BigNumber(NaN)
  const cakeRewardsApr = yearlyCakeRewardAllocation
    .times(cakePriceUsd || BIG_NUMBER_NAN)
    .div(poolLiquidityUsd || BIG_NUMBER_NAN)
    .times(100)
  let cakeRewardsAprAsNumber: number | null = null
  if (!cakeRewardsApr.isNaN() && cakeRewardsApr.isFinite()) {
    cakeRewardsAprAsNumber = cakeRewardsApr.toNumber()
  }
  const lpApr =
    lpRewardsApr ??
    (farmAddress ? (getLpApr(chainId)[farmAddress?.toLowerCase()] || getLpApr(chainId)[farmAddress]) ?? 0 : 0) // can get both checksummed or lowercase
  return { cakeRewardsApr: cakeRewardsAprAsNumber, lpRewardsApr: lpApr }
}

export default null
