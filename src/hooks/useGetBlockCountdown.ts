import { useEffect, useRef, useState } from 'react'
import { BSC_BLOCK_TIME } from 'config'
import { useBlock } from 'state/hooks'

/**
 * Returns a countdown in seconds of a given block
 */
const useBlockCountdown = (blockNumber: number) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(0)
  const { currentBlock } = useBlock()

  useEffect(() => {
    if (currentBlock > 0) {
      const secondsBetweenBlocks = (blockNumber - currentBlock) * BSC_BLOCK_TIME

      // Only start a countdown if the provided block number is greater than the current block
      if (blockNumber > currentBlock) {
        clearInterval(timer.current)
        setSecondsRemaining(secondsBetweenBlocks)

        timer.current = setInterval(() => {
          setSecondsRemaining((prevSecondsRemaining) => {
            if (prevSecondsRemaining === 0) {
              clearInterval(timer.current)
              return 0
            }

            return prevSecondsRemaining - 1
          })
        }, 1000)
      }
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [currentBlock, blockNumber, timer, setSecondsRemaining])

  return secondsRemaining
}

export default useBlockCountdown
