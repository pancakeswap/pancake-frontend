import { BigNumber, FixedNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { FarmWithPrices } from './farmPrices'

// copy from src/config
// const CAKE_PER_BLOCK = 40
const BSC_BLOCK_TIME = 3
const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365 // 10512000
// const CAKE_PER_YEAR = CAKE_PER_BLOCK * BLOCKS_PER_YEAR

const FIXED_ZERO = FixedNumber.from(0)
const FIXED_100 = FixedNumber.from(100)

export const getFarmCakeRewardApr = (
  farm: FarmWithPrices,
  cakePriceBusd: FixedNumber,
  regularCakePerBlock: BigNumber,
) => {
  let cakeRewardsAprAsString = '0'
  if (!cakePriceBusd) {
    return cakeRewardsAprAsString
  }
  const totalLiquidity = FixedNumber.from(farm.lpTotalInQuoteToken).mulUnsafe(
    FixedNumber.from(farm.quoteTokenPriceBusd),
  )
  const poolWeight = FixedNumber.from(farm.poolWeight)
  if (totalLiquidity.isZero() || poolWeight.isZero()) {
    return cakeRewardsAprAsString
  }
  const yearlyCakeRewardAllocation = poolWeight
    ? poolWeight.mulUnsafe(
        FixedNumber.from(BLOCKS_PER_YEAR).mulUnsafe(FixedNumber.from(formatEther(regularCakePerBlock))),
      )
    : FIXED_ZERO
  const cakeRewardsApr = yearlyCakeRewardAllocation
    .mulUnsafe(cakePriceBusd)
    .divUnsafe(totalLiquidity)
    .mulUnsafe(FIXED_100)
  if (!cakeRewardsApr.isZero()) {
    cakeRewardsAprAsString = cakeRewardsApr.toUnsafeFloat().toFixed(2)
  }
  return cakeRewardsAprAsString
}
