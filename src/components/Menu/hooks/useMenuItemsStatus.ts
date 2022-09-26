import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { LinkStatus } from '@pancakeswap/uikit/src/widgets/Menu/types'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { useCurrentBlock } from 'state/block/hooks'
import { PotteryDepositStatus } from 'state/types'
import { getStatus } from 'views/Ifos/hooks/helpers'
import { usePotteryStatus } from './usePotteryStatus'
import { useCompetitionStatus } from './useCompetitionStatus'
import { useVotingStatus } from './useVotingStatus'

export const useMenuItemsStatus = (): Record<string, string | (() => LinkStatus)> => {
  const { chainId } = useActiveWeb3React()
  const currentBlock = useCurrentBlock()
  const activeIfo = useActiveIfoWithBlocks()
  const competitionStatus = useCompetitionStatus()
  const potteryStatus = usePotteryStatus()
  const votingStatus = useVotingStatus()

  const ifoStatus =
    currentBlock && activeIfo && activeIfo.endBlock > currentBlock && chainId === ChainId.BSC
      ? getStatus(currentBlock, activeIfo.startBlock, activeIfo.endBlock)
      : null

  return useMemo(() => {
    return {
      '/competition': competitionStatus,
      '/ifo': ifoStatus === 'coming_soon' ? 'soon' : ifoStatus,
      ...(potteryStatus === PotteryDepositStatus.BEFORE_LOCK && {
        '/pottery': () => <LinkStatus>{ text: 'POT OPEN', color: 'success' },
      }),
      ...(votingStatus && {
        '/voting': () => <LinkStatus>{ text: 'VOTE NOW', color: 'success' },
      }),
    }
  }, [competitionStatus, ifoStatus, potteryStatus, votingStatus])
}
