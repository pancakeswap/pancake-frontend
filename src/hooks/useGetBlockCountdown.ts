import { useEffect, useRef, useState } from 'react'
import { BSC_BLOCK_TIME } from 'config'
import { useInitialBlock } from 'state/hooks'

/**
 * Returns a countdown in seconds of a given block
 */
const useBlockCountdown = (blockNumber: number) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const initialBlock = useInitialBlock()

  useEffect(() => {
    // Clear old intervals
    clearInterval(timer.current)

    if (initialBlock > 0) {
      const secondsBetweenBlocks = (blockNumber - initialBlock) * BSC_BLOCK_TIME

      // Only start a countdown if the provided block number is greater than the current block
      if (blockNumber > initialBlock) {
        setSecondsRemaining(secondsBetweenBlocks)

        timer.current = setInterval(() => {
          setSecondsRemaining((prevSecondsRemaining) => prevSecondsRemaining - 1)
        }, 1000)
      }
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [initialBlock, blockNumber, timer, setSecondsRemaining])

  useEffect(() => {
    if (timer.current && secondsRemaining === 0) {
      clearInterval(timer.current)
    }
  }, [secondsRemaining, timer])

  return secondsRemaining
}

export default useBlockCountdown
