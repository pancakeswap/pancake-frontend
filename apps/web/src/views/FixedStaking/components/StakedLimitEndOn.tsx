import { formatTime } from 'utils/formatTime'

import { useCurrenDay } from '../hooks/useStakedPools'

export function StakedLimitEndOn({ lockPeriod, poolEndDay }: { lockPeriod: number; poolEndDay: number }) {
  const lastDayAction = useCurrenDay()

  /**
   * Duplicate logic on Smart Contract
   *  uint32 lockEndDay = info.userInfo.lastDayAction + info.pool.lockPeriod;
        info.endLockTime = info.userInfo.userDeposit > 0
        ? lockEndDay < info.pool.endDay ? lockEndDay * 86400 + 43200 : info.pool.endDay * 86400 + 43200
        : info.userInfo.lastDayAction * 86400 + 43200;
   */

  const lockEndDay = lastDayAction + lockPeriod

  const exceedPoolEndDay = lockEndDay < poolEndDay

  const endTime = exceedPoolEndDay ? lockEndDay : poolEndDay

  return <>{formatTime((endTime * 86400 + 43200) * 1_000)}</>
}
