import { Text } from '@pancakeswap/uikit'

import { formatTime } from 'utils/formatTime'

import { useCurrenDay } from '../hooks/useStakedPools'

export function StakedLimitEndOn({ lockPeriod }: { lockPeriod: number }) {
  const currentDate = useCurrenDay()

  const endTime = ((currentDate + lockPeriod) * 86400 + 43200) * 1_000

  return <Text bold>{formatTime(endTime)}</Text>
}
