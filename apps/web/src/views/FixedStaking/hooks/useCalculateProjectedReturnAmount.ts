import { CurrencyAmount, Percent, Token } from '@pancakeswap/swap-sdk-core'
import { useMemo } from 'react'
import { StakePositionUserInfo } from '../type'
import { DAYS_A_YEAR } from '../constant'

export function useCalculateProjectedReturnAmount({
  token,
  stakePositionUserInfo,
  lockPeriod,
  apr,
}: {
  token: Token
  lockPeriod: number
  apr: Percent
  stakePositionUserInfo: StakePositionUserInfo
}) {
  const amountDeposit = useMemo(
    () => CurrencyAmount.fromRawAmount(token, stakePositionUserInfo.userDeposit.toString()),
    [stakePositionUserInfo.userDeposit, token],
  )
  const accrueInterest = useMemo(
    () => CurrencyAmount.fromRawAmount(token, stakePositionUserInfo.accrueInterest.toString()),
    [stakePositionUserInfo.accrueInterest, token],
  )

  return useMemo(
    () => ({
      projectedReturnAmount: amountDeposit
        ?.multiply(lockPeriod)
        ?.multiply(apr.multiply(lockPeriod).divide(DAYS_A_YEAR)),
      accrueInterest,
      amountDeposit,
    }),
    [accrueInterest, amountDeposit, apr, lockPeriod],
  )
}
