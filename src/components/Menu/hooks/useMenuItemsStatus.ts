import { useMemo } from 'react'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { useCurrentBlock } from 'state/block/hooks'
import { getStatus } from 'views/Ifos/hooks/helpers'

export const useMenuItemsStatus = (): Record<string, string> => {
  const currentBlock = useCurrentBlock()
  const activeIfo = useActiveIfoWithBlocks()

  const ifoStatus =
    currentBlock && activeIfo && activeIfo.endBlock > currentBlock
      ? getStatus(currentBlock, activeIfo.startBlock, activeIfo.endBlock)
      : null

  return useMemo(() => {
    return ifoStatus
      ? {
          '/ifo': ifoStatus === 'coming_soon' ? 'soon' : ifoStatus,
        }
      : null
  }, [ifoStatus])
}
