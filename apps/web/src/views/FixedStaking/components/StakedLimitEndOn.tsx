import { formatUnixTime } from 'utils/formatTime'

import { useCurrentDay } from '../hooks/useStakedPools'

export function StakedLimitEndOn({ lockPeriod, poolEndDay }: { lockPeriod?: number; poolEndDay?: number }) {
  const lastDayAction = useCurrentDay()

  /**
   * Duplicate logic on Smart Contract
   *  uint32 lockEndDay = info.userInfo.lastDayAction + info.pool.lockPeriod;
        info.endLockTime = info.userInfo.userDeposit > 0
        ? lockEndDay < info.pool.endDay ? lockEndDay * 86400 + 43200 : info.pool.endDay * 86400 + 43200
        : info.userInfo.lastDayAction * 86400 + 43200;
   */

  if (!lockPeriod || !poolEndDay) {
    return null
  }

  const lockEndDay = lastDayAction + lockPeriod

  const exceedPoolEndDay = lockEndDay > poolEndDay

  const endTime = exceedPoolEndDay ? poolEndDay : lockEndDay

  return <>{formatUnixTime(endTime * 86400 + 43200)}</>
}
