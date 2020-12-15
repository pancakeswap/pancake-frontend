import { usePoolFromPid } from 'state/hooks'
import useBlock from './useBlock'

const useSousLeftBlocks = (sousId) => {
  const { startBlock, endBlock, isFinished } = usePoolFromPid(sousId)
  const block = useBlock()

  return {
    blocksUntilStart: Math.max(startBlock - block, 0),
    blocksRemaining: Math.max(endBlock - block, 0),
    isFinished: sousId === 0 ? false : isFinished || block > endBlock,
  }
}

export default useSousLeftBlocks
