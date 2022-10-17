import { useMemo } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { useChainCurrentBlock } from 'state/block/hooks'
import { PotteryDepositStatus } from 'state/types'
import { getStatus } from 'views/Ifos/hooks/helpers'
import { usePotteryStatus } from './usePotteryStatus'
import { useCompetitionStatus } from './useCompetitionStatus'

export const useMenuItemsStatus = (): Record<string, string> => {
  const currentBlock = useChainCurrentBlock(ChainId.BSC)
  const activeIfo = useActiveIfoWithBlocks()
  const competitionStatus = useCompetitionStatus()
  const potteryStatus = usePotteryStatus()

  const ifoStatus =
    currentBlock && activeIfo && activeIfo.endBlock > currentBlock
      ? getStatus(currentBlock, activeIfo.startBlock, activeIfo.endBlock)
      : null

  return useMemo(() => {
    return {
      '/competition': competitionStatus,
      '/ifo': ifoStatus === 'coming_soon' ? 'soon' : ifoStatus,
      ...(potteryStatus === PotteryDepositStatus.BEFORE_LOCK && {
        '/pottery': 'pot_open',
      }),
    }
  }, [competitionStatus, ifoStatus, potteryStatus])
}
