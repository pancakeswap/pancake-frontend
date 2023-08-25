import { CurrencyAmount, Percent, Token } from '@pancakeswap/swap-sdk-core'
import { useMemo } from 'react'
import { DAYS_A_YEAR } from '../constant'
import { useCurrenDay } from './useStakedPools'

export function useCalculateProjectedReturnAmount({
  amountDeposit,
  lockPeriod,
  apr,
  unlockAPR,
  poolEndDay,
  lastDayAction,
}: {
  amountDeposit: CurrencyAmount<Token>
  lockPeriod: number
  poolEndDay: number
  lastDayAction: number
  apr: Percent
  unlockAPR: Percent
}) {
  const currentDay = useCurrenDay()

  const lockEndDay = lastDayAction + lockPeriod

  const unlockPeriod = currentDay > lockEndDay ? currentDay - lockEndDay : 0
  const finalLockedPeriod = poolEndDay < lockEndDay ? poolEndDay - lastDayAction : lockPeriod

  const lockReward = amountDeposit
    ?.multiply(finalLockedPeriod)
    ?.multiply(apr.multiply(finalLockedPeriod).divide(DAYS_A_YEAR))
  const unlockReward = amountDeposit
    ?.multiply(unlockPeriod)
    ?.multiply(unlockAPR.multiply(unlockPeriod).divide(DAYS_A_YEAR))

  return useMemo(
    () => ({
      projectedReturnAmount: lockReward.add(unlockReward),
      amountDeposit,
    }),
    [amountDeposit, lockReward, unlockReward],
  )
}
