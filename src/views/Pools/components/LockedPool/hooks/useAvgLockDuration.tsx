import { useMemo } from 'react'
import { BOOST_WEIGHT, DURATION_FACTOR } from 'config/constants/pools'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { useCakeVault } from 'state/pools/hooks'
import { getFullDecimalMultiplier } from 'utils/getFullDecimalMultiplier'

import formatSecondsToWeeks from '../../utils/formatSecondsToWeeks'

export default function useAvgLockDuration() {
  const { totalLockedAmount, totalShares, totalCakeInVault, pricePerFullShare } = useCakeVault()

  const avgLockDurationsInSeconds = useMemo(() => {
    const flexibleCakeAmount = totalCakeInVault.minus(totalLockedAmount)
    const flexibleCakeShares = flexibleCakeAmount.div(pricePerFullShare).times(getFullDecimalMultiplier(18))
    const lockedCakeBoostedShares = totalShares.minus(flexibleCakeShares)
    const lockedCakeOriginalShares = totalLockedAmount.div(pricePerFullShare).times(getFullDecimalMultiplier(18))
    const avgBoostRatio = lockedCakeBoostedShares.div(lockedCakeOriginalShares)

    return avgBoostRatio
      .minus(1)
      .times(new BigNumber(DURATION_FACTOR.toString()))
      .div(new BigNumber(BOOST_WEIGHT.toString()).div(getFullDecimalMultiplier(12)))
      .toFixed(0)
  }, [totalCakeInVault, totalLockedAmount, pricePerFullShare, totalShares])

  const avgLockDurationsInWeeks = useMemo(
    () => formatSecondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  return {
    avgLockDurationsInWeeks,
    avgLockDurationsInSeconds: _toNumber(avgLockDurationsInSeconds),
  }
}
