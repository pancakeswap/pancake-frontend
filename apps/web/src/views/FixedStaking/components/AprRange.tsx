import { Percent } from '@pancakeswap/sdk'
import { DAYS_A_YEAR, PERCENT_DIGIT } from '../constant'

export function calculateAPRPercent(percent: number) {
  return new Percent(percent, PERCENT_DIGIT).multiply(DAYS_A_YEAR)
}

export function AprRange({
  minLockDayPercent,
  maxLockDayPercent,
}: {
  minLockDayPercent: number
  maxLockDayPercent: number
}) {
  const minAPR = calculateAPRPercent(minLockDayPercent)
  const maxAPR = calculateAPRPercent(maxLockDayPercent)

  return (
    <>
      {minAPR.toSignificant(2)}% ~ {maxAPR.toSignificant(2)}%
    </>
  )
}
