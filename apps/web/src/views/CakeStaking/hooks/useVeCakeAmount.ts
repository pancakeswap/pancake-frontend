import { useMemo } from 'react'
import { getVeCakeAmount } from 'utils/getVeCakeAmount'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

// calculate estimated veCake amount with locked cake amount and duration
export const useVeCakeAmount = (lockedAmount: string | number | bigint, unlockTimestamp: number) => {
  const currentBlockTimestamp = useCurrentBlockTimestamp()
  return useMemo(() => {
    if (currentBlockTimestamp > unlockTimestamp) return 0
    return getVeCakeAmount(lockedAmount, unlockTimestamp - currentBlockTimestamp)
  }, [currentBlockTimestamp, lockedAmount, unlockTimestamp])
}
