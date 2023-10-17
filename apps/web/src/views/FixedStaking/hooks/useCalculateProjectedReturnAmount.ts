import { Currency, CurrencyAmount, Percent } from '@pancakeswap/swap-sdk-core'
import { useMemo } from 'react'
import { DAYS_A_YEAR } from '../constant'
import { useCurrentDay } from './useStakedPools'

export function useCalculateProjectedReturnAmount({
  amountDeposit,
  lockPeriod,
  apr,
  unlockAPR,
  poolEndDay,
  lastDayAction,
}: {
  amountDeposit: CurrencyAmount<Currency>
  lockPeriod: number
  poolEndDay: number
  lastDayAction: number
  apr: Percent
  unlockAPR: Percent
}) {
  const currentDay = useCurrentDay()

  const lockEndDay = lastDayAction + lockPeriod

  /**
   * In locked period (currentDay <= lockEndDay)
   *  finalLockedPeriod = lockPeriod
   *  unlockPeriod = 0
   * After locked period (currentDay > lockEndDay)
   *  finalLockedPeriod = lockPeriod
   *  unlockPeriod = currentDay - lockEndDay
   * After pool ended day (currentDay >= poolEnday)
   *  finalLockedPeriod = lockPeriod
   *  unlockPeriod = poolEndDay - lockEndDay
   * Special case, if lockEndDay > poolEndDay
   *  finalLockedPeriod = poolEnday - lastDayAction
   */
  const unlockPeriod =
    currentDay <= lockEndDay ? 0 : currentDay >= poolEndDay ? poolEndDay - lockEndDay : currentDay - lockEndDay
  const finalLockedPeriod = lockEndDay > poolEndDay ? poolEndDay - lastDayAction : lockPeriod

  const lockReward = amountDeposit?.multiply(finalLockedPeriod)?.multiply(apr.divide(DAYS_A_YEAR))
  const unlockReward = amountDeposit?.multiply(unlockPeriod)?.multiply(unlockAPR.divide(DAYS_A_YEAR))

  return useMemo(
    () => ({
      projectedReturnAmount: lockReward.add(unlockReward),
      amountDeposit,
    }),
    [amountDeposit, lockReward, unlockReward],
  )
}
