import { ChainId } from '@pancakeswap/chains'
import { BSC_BLOCK_TIME } from 'config'
import { useEffect, useRef, useState } from 'react'
import { publicClient } from 'utils/wagmi'

/**
 * Returns a countdown in seconds of a given block
 */
const useBlockCountdown = (blockNumber: number) => {
  const timer = useRef<NodeJS.Timeout | null>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  useEffect(() => {
    const startCountdown = async () => {
      const bscClient = publicClient({ chainId: ChainId.BSC })
      const currentBlock = await bscClient.getBlockNumber()

      if (blockNumber > currentBlock) {
        setSecondsRemaining((blockNumber - Number(currentBlock)) * BSC_BLOCK_TIME)

        // Clear previous interval
        if (timer.current) {
          clearInterval(timer.current)
        }

        timer.current = setInterval(() => {
          setSecondsRemaining((prevSecondsRemaining) => {
            if (prevSecondsRemaining === 1) {
              if (timer.current) {
                clearInterval(timer.current)
              }
            }

            return prevSecondsRemaining - 1
          })
        }, 1000)
      }
    }

    startCountdown()

    return () => {
      if (timer.current) {
        clearInterval(timer.current)
      }
    }
  }, [setSecondsRemaining, blockNumber, timer])

  return secondsRemaining
}

export default useBlockCountdown
