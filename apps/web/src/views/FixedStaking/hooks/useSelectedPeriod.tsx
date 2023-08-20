import { differenceInMilliseconds } from 'date-fns'
import { useMemo, useState } from 'react'

export default function useSelectedPeriod({ pool, stakedPositions }) {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number | null>(null)

  const claimedPeriods = useMemo(
    () =>
      stakedPositions
        .filter((sP) => differenceInMilliseconds(sP.endLockTime * 1_000, new Date()) <= 0)
        .map((sP) => sP.pool.lockPeriod),
    [stakedPositions],
  )

  const disabledIndexes = useMemo(
    () => pool.pools.map((p, index) => (claimedPeriods.includes(p.lockPeriod) ? index : undefined)),
    [claimedPeriods, pool.pools],
  )

  const selectedPool = pool.pools[selectedPeriodIndex]

  return {
    setSelectedPeriodIndex,
    selectedPeriodIndex,
    selectedPool,
    disabledIndexes,
  }
}
