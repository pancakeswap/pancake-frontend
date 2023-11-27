import { DAY_IN_SECONDS } from '@pancakeswap/utils/getTimePeriods'
import { WEEK } from 'config/constants/veCake'
import { useMemo } from 'react'
import { useCurrentBlockTimestamp } from 'views/CakeStaking/hooks/useCurrentBlockTimestamp'

const TWO_WEEKS = WEEK * 2

export const useCurrentEpochStart = () => {
  const currentTimestamp = useCurrentBlockTimestamp()

  const currentEpoch = useMemo(() => {
    return Math.floor(currentTimestamp / TWO_WEEKS) * TWO_WEEKS
  }, [currentTimestamp])

  return currentEpoch
}

// epoch end is 1 day before next epoch start
// last 24 hours of epoch are admin only
export const useCurrentEpochEnd = (): number => {
  const currentEpochStart = useCurrentEpochStart()

  return useMemo(() => currentEpochStart + TWO_WEEKS - DAY_IN_SECONDS, [currentEpochStart])
}

export const useNextEpochStart = (): number => {
  const currentEpochStart = useCurrentEpochStart()

  return useMemo(() => currentEpochStart + TWO_WEEKS, [currentEpochStart])
}

export const useEpochOnTally = (): boolean => {
  const epochEnd = useCurrentEpochEnd()
  const nextEpochStart = useNextEpochStart()
  const currentTimestamp = useCurrentBlockTimestamp()
  const onTally = useMemo(() => {
    return epochEnd < currentTimestamp && currentTimestamp < nextEpochStart
  }, [epochEnd, nextEpochStart, currentTimestamp])

  return onTally
}
