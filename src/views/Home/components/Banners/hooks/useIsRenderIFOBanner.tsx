import { useCurrentBlockWithStatus } from 'state/block/hooks'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'

const useIsRenderIfoBanner = () => {
  const { currentBlock, isLoading } = useCurrentBlockWithStatus()

  const activeIfoWithBlocks = useActiveIfoWithBlocks()

  return {
    isRenderIFOBanner: !!(currentBlock && activeIfoWithBlocks && activeIfoWithBlocks.endBlock > currentBlock),
    isIFOLoading: isLoading || activeIfoWithBlocks,
  }
}

export default useIsRenderIfoBanner
