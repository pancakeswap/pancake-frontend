import { ChainId } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { useIsUserLockedEnd } from 'hooks/useLockedEndNotification'
import { useMemo } from 'react'
import { useFarms } from 'state/farms/hooks'
import { useChainCurrentBlock } from 'state/block/hooks'
import { PotteryDepositStatus } from 'state/types'
import { getStatus } from 'views/Ifos/hooks/helpers'
import { useCompetitionStatus } from './useCompetitionStatus'
import { usePotteryStatus } from './usePotteryStatus'
import { useVotingStatus } from './useVotingStatus'

export const useMenuItemsStatus = (): Record<string, string> => {
  const currentBlock = useChainCurrentBlock(ChainId.BSC)
  const activeIfo = useActiveIfoWithBlocks()
  const competitionStatus = useCompetitionStatus()
  const potteryStatus = usePotteryStatus()
  const votingStatus = useVotingStatus()
  const isUserLocked = useIsUserLockedEnd()

  const ifoStatus =
    currentBlock && activeIfo && activeIfo.endBlock > currentBlock
      ? getStatus(currentBlock, activeIfo.startBlock, activeIfo.endBlock)
      : null

  const { data: farmsLP } = useFarms()
  const inactiveFarms = farmsLP.filter(
    (farm) =>
      farm.lpAddress === '0xB6040A9F294477dDAdf5543a24E5463B8F2423Ae' ||
      farm.lpAddress === '0x272c2CF847A49215A3A1D4bFf8760E503A06f880' ||
      (farm.pid !== 0 && farm.multiplier === '0X'),
  )
  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) =>
      farm.userData &&
      (new BigNumber(farm.userData.stakedBalance).isGreaterThan(0) ||
        new BigNumber(farm.userData.proxy?.stakedBalance).isGreaterThan(0)),
  )
  const hasStakeInFinishedFarms = stakedInactiveFarms.length > 0

  return useMemo(() => {
    return {
      '/competition': competitionStatus,
      '/ifo': ifoStatus === 'coming_soon' ? 'soon' : ifoStatus,
      ...(potteryStatus === PotteryDepositStatus.BEFORE_LOCK && {
        '/pottery': 'pot_open',
      }),
      ...(votingStatus && {
        '/voting': votingStatus,
      }),
      ...(isUserLocked && {
        '/pools': 'lock_end',
      }),
      ...(hasStakeInFinishedFarms && {
        '/farms': 'finished',
      }),
    }
  }, [competitionStatus, ifoStatus, potteryStatus, votingStatus, isUserLocked, hasStakeInFinishedFarms])
}
