import { useMemo } from 'react'
import { BOOST_WEIGHT, DURATION_FACTOR } from '@pancakeswap/pools'
import BigNumber from 'bignumber.js'
import { useCakeVault } from 'state/pools/hooks'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'

import { DEFAULT_TOKEN_DECIMAL } from 'config'
import formatSecondsToWeeks, { secondsToWeeks } from '../../utils/formatSecondsToWeeks'

export default function useAvgLockDuration() {
  const { totalLockedAmount, totalShares, totalCakeInVault, pricePerFullShare } = useCakeVault()

  const avgLockDurationsInSeconds = useMemo(() => {
    const flexibleCakeAmount = totalCakeInVault.minus(totalLockedAmount)
    const flexibleCakeShares = flexibleCakeAmount.div(pricePerFullShare).times(DEFAULT_TOKEN_DECIMAL)
    const lockedCakeBoostedShares = totalShares.minus(flexibleCakeShares)
    const lockedCakeOriginalShares = totalLockedAmount.div(pricePerFullShare).times(DEFAULT_TOKEN_DECIMAL)
    const avgBoostRatio = lockedCakeBoostedShares.div(lockedCakeOriginalShares)

    return (
      Math.round(
        avgBoostRatio
          .minus(1)
          .times(new BigNumber(DURATION_FACTOR.toString()))
          .div(new BigNumber(BOOST_WEIGHT.toString()).div(getFullDecimalMultiplier(12)))
          .toNumber(),
      ) || 0
    )
  }, [totalCakeInVault, totalLockedAmount, pricePerFullShare, totalShares])

  const avgLockDurationsInWeeks = useMemo(
    () => formatSecondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  const avgLockDurationsInWeeksNum = useMemo(
    () => secondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  return {
    avgLockDurationsInWeeks,
    avgLockDurationsInWeeksNum,
    avgLockDurationsInSeconds,
  }
}
