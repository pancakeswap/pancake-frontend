import { useMemo } from 'react'
import { BOOST_WEIGHT, DURATION_FACTOR } from '@pancakeswap/pools'
import BigNumber from 'bignumber.js'
import { useCakeVault } from 'state/pools/hooks'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'

import { DEFAULT_TOKEN_DECIMAL } from 'config'
import formatSecondsToWeeks, { secondsToWeeks } from '../../utils/formatSecondsToWeeks'

const ZERO = new BigNumber(0)
const ONE = new BigNumber(1)

export default function useAvgLockDuration() {
  const { totalLockedAmount, totalShares, totalCakeInVault, pricePerFullShare } = useCakeVault()

  const avgLockDurationsInSeconds = useMemo(() => {
    const flexibleCakeAmount = totalCakeInVault?.minus(totalLockedAmount || ZERO)
    const flexibleCakeShares = flexibleCakeAmount?.div(pricePerFullShare || ONE).times(DEFAULT_TOKEN_DECIMAL)
    const lockedCakeBoostedShares = totalShares?.minus(flexibleCakeShares || ZERO)
    const lockedCakeOriginalShares = totalLockedAmount?.div(pricePerFullShare || ONE).times(DEFAULT_TOKEN_DECIMAL)
    const avgBoostRatio = lockedCakeBoostedShares?.div(lockedCakeOriginalShares || ONE)

    return (
      Math.round(
        avgBoostRatio
          ?.minus(1)
          .times(new BigNumber(DURATION_FACTOR.toString()))
          .div(new BigNumber(BOOST_WEIGHT.toString()).div(getFullDecimalMultiplier(12)))
          .toNumber() ?? 0,
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
