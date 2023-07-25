import { useUserCakeLockStatus } from 'hooks/useUserCakeLockStatus'
import { useMemo } from 'react'
import { PotteryDepositStatus } from 'state/types'
import { useCompetitionStatus } from './useCompetitionStatus'
import { usePotteryStatus } from './usePotteryStatus'
import { useVotingStatus } from './useVotingStatus'
import { useTradingRewardStatus } from './useTradingRewardStatus'
import { useIfoStatus } from './useIfoStatus'

export const useMenuItemsStatus = (): Record<string, string> => {
  const ifoStatus = useIfoStatus()
  const competitionStatus = useCompetitionStatus()
  const potteryStatus = usePotteryStatus()
  const votingStatus = useVotingStatus()
  const isUserLocked = useUserCakeLockStatus()
  const tradingRewardStatus = useTradingRewardStatus()

  return useMemo(() => {
    return {
      '/competition': competitionStatus,
      '/ifo': ifoStatus,
      ...(potteryStatus === PotteryDepositStatus.BEFORE_LOCK && {
        '/pottery': 'pot_open',
      }),
      ...(votingStatus && {
        '/voting': votingStatus,
      }),
      ...(isUserLocked && {
        '/pools': 'lock_end',
      }),
      ...(tradingRewardStatus && {
        '/trading-reward': tradingRewardStatus,
      }),
    }
  }, [competitionStatus, ifoStatus, potteryStatus, votingStatus, isUserLocked, tradingRewardStatus])
}
