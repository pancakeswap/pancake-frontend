import { CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { useMemo } from 'react'

export function useCalculateProjectedReturnAmount({ token, stakePositionUserInfo, lockPeriod, apr }) {
  const amountDeposit = useMemo(
    () => CurrencyAmount.fromRawAmount(token, stakePositionUserInfo.userDeposit.toString()),
    [stakePositionUserInfo.userDeposit, token],
  )
  const accrueInterest = useMemo(
    () => CurrencyAmount.fromRawAmount(token, stakePositionUserInfo.accrueInterest.toString()),
    [stakePositionUserInfo.accrueInterest, token],
  )

  const projectedReturnAmount = amountDeposit?.multiply(lockPeriod)?.multiply(apr.multiply(lockPeriod).divide(365))

  return useMemo(
    () => ({
      projectedReturnAmount,
      accrueInterest,
      amountDeposit,
    }),
    [accrueInterest, amountDeposit, projectedReturnAmount],
  )
}
