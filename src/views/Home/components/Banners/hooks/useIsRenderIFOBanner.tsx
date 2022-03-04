import { useCurrentBlock } from 'state/block/hooks'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { getStatus } from 'views/Ifos/hooks/helpers'

const useIsRenderIfoBanner = () => {
  const currentBlock = useCurrentBlock()

  const activeIfoWithBlocks = useActiveIfoWithBlocks()

  const isIfoAlive = !!(currentBlock && activeIfoWithBlocks && activeIfoWithBlocks.endBlock > currentBlock)
  const status = isIfoAlive
    ? getStatus(currentBlock, activeIfoWithBlocks.startBlock, activeIfoWithBlocks.endBlock)
    : null
  return Boolean(isIfoAlive && status)
}

export default useIsRenderIfoBanner
