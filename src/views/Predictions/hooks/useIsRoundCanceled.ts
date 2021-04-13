import { useBlock, useGetCurrentEpoch, useGetTotalIntervalBlocks } from 'state/hooks'
import { Round } from 'state/types'

const useIsRoundCanceled = (round: Round) => {
  const { epoch, closePrice, lockBlock, lockPrice } = round
  const { currentBlock } = useBlock()
  const currentEpoch = useGetCurrentEpoch()
  const totalInterval = useGetTotalIntervalBlocks()

  // Like the current epoch there is no way to tell if a future round is canceled
  if (epoch > currentEpoch) {
    return false
  }

  // No way to tell currently if the current epoch is canceled
  if (epoch === currentEpoch && lockPrice === null) {
    return false
  }

  // Live cards
  if (closePrice === null && epoch === currentEpoch - 1) {
    return currentBlock - lockBlock > totalInterval
  }

  // Finally, past rounds were canceled if no close price was set
  return closePrice === null
}

export default useIsRoundCanceled
