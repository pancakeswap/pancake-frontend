import { CurrencyAmount, Percent, Token } from '@pancakeswap/swap-sdk-core'
import { useMemo } from 'react'
import { DAYS_A_YEAR } from '../constant'

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
  const lockEndDay = lastDayAction + lockPeriod
  const unlockPeriod = poolEndDay - lockEndDay

  const lockReward = amountDeposit?.multiply(lockPeriod)?.multiply(apr.multiply(lockPeriod).divide(DAYS_A_YEAR))
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
