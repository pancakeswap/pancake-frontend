import { useChainCurrentBlock } from 'state/block/hooks'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { ChainId } from '@pancakeswap/chains'

const useIsRenderIfoBanner = () => {
  const currentBlock = useChainCurrentBlock(ChainId.BSC)

  const activeIfoWithBlocks = useActiveIfoWithBlocks()

  return !!(currentBlock && activeIfoWithBlocks && activeIfoWithBlocks.endBlock > currentBlock)
}

export default useIsRenderIfoBanner
