import { useChainCurrentBlock } from 'state/block/hooks'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { ChainId } from '@pancakeswap/sdk'

const useIsRenderIfoBanner = () => {
  const currentBlock = useChainCurrentBlock(ChainId.BSC)

  const activeIfoWithBlocks = useActiveIfoWithBlocks()

  return !!(currentBlock && activeIfoWithBlocks && activeIfoWithBlocks.endBlock > currentBlock)
}

export default useIsRenderIfoBanner
