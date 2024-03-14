import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { FixedStakingPool } from '../type'

export default function useSelectedPeriod({ pool, stakedPositions }) {
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState<number | null>(null)

  const claimedPeriods = useMemo(
    () => stakedPositions.filter((sP) => dayjs.unix(sP.endLockTime).diff(dayjs()) <= 0).map((sP) => sP.pool.lockPeriod),
    [stakedPositions],
  )

  const lockedPeriods = useMemo(
    () => stakedPositions.filter((sP) => dayjs.unix(sP.endLockTime).diff(dayjs()) > 0).map((sP) => sP.pool.lockPeriod),
    [stakedPositions],
  )

  const claimedIndexes: number[] = useMemo(
    () => pool.pools.map((p, index) => (claimedPeriods.includes(p.lockPeriod) ? index : undefined)),
    [claimedPeriods, pool.pools],
  )

  const lockedIndexes: number[] = useMemo(
    () => pool.pools.map((p, index) => (lockedPeriods.includes(p.lockPeriod) ? index : undefined)),
    [lockedPeriods, pool.pools],
  )

  const selectedPool: FixedStakingPool | undefined =
    selectedPeriodIndex !== null ? pool.pools[selectedPeriodIndex] : undefined

  return {
    setSelectedPeriodIndex,
    selectedPeriodIndex,
    selectedPool,
    claimedIndexes,
    lockedIndexes,
  }
}
