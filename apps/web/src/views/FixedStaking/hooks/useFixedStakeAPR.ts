import { Percent } from '@pancakeswap/sdk'
import { useMemo } from 'react'
import { DAYS_A_YEAR, PERCENT_DIGIT } from '../constant'

export function useFixedStakeAPR({
  boostDayPercent,
  lockDayPercent,
  unlockDayPercent,
}: {
  boostDayPercent: number
  lockDayPercent: number
  unlockDayPercent: number
}) {
  return useMemo(
    () => ({
      boostAPR: new Percent(boostDayPercent || 0, PERCENT_DIGIT).multiply(DAYS_A_YEAR),
      lockAPR: new Percent(lockDayPercent || 0, PERCENT_DIGIT).multiply(DAYS_A_YEAR),
      unlockAPR: new Percent(unlockDayPercent || 0, PERCENT_DIGIT).multiply(DAYS_A_YEAR),
    }),
    [boostDayPercent, lockDayPercent, unlockDayPercent],
  )
}
