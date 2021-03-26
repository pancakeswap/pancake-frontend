import { useEffect, useRef, useState } from 'react'
import { BSC_BLOCK_TIME } from 'config'
import { getWeb3NoAccount } from 'utils/web3'

/**
 * Returns a countdown in seconds of a given block
 */
const useBlockCountdown = (blockNumber: number) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const web3 = getWeb3NoAccount()
      const currentBlockNumber = await web3.eth.getBlockNumber()
      const secondsBetweenBlocks = (blockNumber - currentBlockNumber) * BSC_BLOCK_TIME

      setSecondsRemaining(secondsBetweenBlocks)

      // Only start a countdown if the provided block number is greater than the current block
      if (blockNumber > currentBlockNumber) {
        timer.current = setInterval(() => {
          setSecondsRemaining((prevSecondsRemaining) => prevSecondsRemaining - 1)
        }, 1000)
      }
    }

    fetchData()

    return () => {
      clearInterval(timer.current)
    }
  }, [blockNumber, timer, setSecondsRemaining])

  useEffect(() => {
    if (timer.current && secondsRemaining === 0) {
      clearInterval(timer.current)
    }
  }, [secondsRemaining, timer])

  return secondsRemaining
}

export default useBlockCountdown
