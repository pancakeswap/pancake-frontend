import { useCurrentBlockWithStatus } from 'state/block/hooks'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'

const useIsRenderIfoBanner = () => {
  const { currentBlock } = useCurrentBlockWithStatus()

  const activeIfoWithBlocks = useActiveIfoWithBlocks()

  return !!(currentBlock && activeIfoWithBlocks && activeIfoWithBlocks.endBlock > currentBlock)
}

export default useIsRenderIfoBanner
