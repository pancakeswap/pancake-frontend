import { formatTime } from 'utils/formatTime'

import { useCurrentDay } from '../hooks/useStakedPools'

export function StakedLimitEndOn({
  lockPeriod,
  poolEndDay,
  unlockTime,
}: {
  lockPeriod: number
  poolEndDay: number
  unlockTime?: number
}) {
  const lastDayAction = useCurrentDay()

  /**
   * Duplicate logic on Smart Contract
   *  uint32 lockEndDay = info.userInfo.lastDayAction + info.pool.lockPeriod;
        info.endLockTime = info.userInfo.userDeposit > 0
        ? lockEndDay < info.pool.endDay ? lockEndDay * 86400 + 43200 : info.pool.endDay * 86400 + 43200
        : info.userInfo.lastDayAction * 86400 + 43200;
   */

  const lockEndDay = unlockTime || lastDayAction + lockPeriod

  const exceedPoolEndDay = lockEndDay > poolEndDay

  const endTime = exceedPoolEndDay ? poolEndDay : lockEndDay

  return <>{formatTime((endTime * 86400 + 43200) * 1_000)}</>
}
