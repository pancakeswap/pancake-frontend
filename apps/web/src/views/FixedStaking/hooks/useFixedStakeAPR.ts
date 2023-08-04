import { Percent } from '@pancakeswap/sdk'
import { useMemo } from 'react'

const PERCENT_NUMBER = 1000000000

export function useFixedStakeAPR({
  boostDayPercent,
  lockDayPercent,
}: {
  boostDayPercent: number
  lockDayPercent: number
}) {
  return useMemo(
    () => ({
      boostAPR: new Percent(boostDayPercent || 0, PERCENT_NUMBER).multiply(365),
      lockAPR: new Percent(lockDayPercent || 0, PERCENT_NUMBER).multiply(365),
    }),
    [boostDayPercent, lockDayPercent],
  )
}
