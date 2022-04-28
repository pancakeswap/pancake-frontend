import { useMemo } from 'react'
import { useLockPoolConfigVariables } from 'hooks/useVaultApy'
import BigNumber from 'bignumber.js'
import _toNumber from 'lodash/toNumber'
import { useCakeVault } from 'state/pools/hooks'
import { BIG_TEN } from 'utils/bigNumber'

import formatSecondsToWeeks from '../utils/formatSecondsToWeeks'

export default function useAvgLockDuration() {
  const { totalLockedAmount, totalShares, totalCakeInVault, pricePerFullShare } = useCakeVault()

  const { boostWeight, durationFactor } = useLockPoolConfigVariables()

  const avgLockDurationsInSeconds = useMemo(() => {
    const flexibleCakeAmount = totalCakeInVault.minus(totalLockedAmount)
    const flexibleCakeShares = flexibleCakeAmount.div(pricePerFullShare).times(BIG_TEN.pow(18))
    const lockedCakeBoostedShares = totalShares.minus(flexibleCakeShares)
    const lockedCakeOriginalShares = totalLockedAmount.div(pricePerFullShare).times(BIG_TEN.pow(18))
    const avgBoostRatio = lockedCakeBoostedShares.div(lockedCakeOriginalShares)

    return avgBoostRatio
      .minus(1)
      .times(new BigNumber(durationFactor.toString()))
      .div(new BigNumber(boostWeight.toString()).div(BIG_TEN.pow(12)))
      .toFixed(0)
  }, [totalCakeInVault, durationFactor, totalLockedAmount, pricePerFullShare, totalShares, boostWeight])

  const avgLockDurationsInWeeks = useMemo(
    () => formatSecondsToWeeks(avgLockDurationsInSeconds),
    [avgLockDurationsInSeconds],
  )

  return {
    avgLockDurationsInWeeks,
    avgLockDurationsInSeconds: _toNumber(avgLockDurationsInSeconds),
  }
}
