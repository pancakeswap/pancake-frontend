import { BSC_BLOCK_TIME } from 'config'
import { useEffect, useRef, useState } from 'react'
import getTimePeriods from 'utils/getTimePeriods'
import { getWeb3NoAccount } from 'utils/web3'

/**
 * Returns the difference of blocks and estimated seconds
 */
const useBlockCountdown = (blockNumber: number) => {
  const timer = useRef<ReturnType<typeof setTimeout>>(null)
  const [currentBlock, setCurrentBlock] = useState(null)
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  // Step 1 - Fetch current block
  useEffect(() => {
    const fetchCurrentBlock = async () => {
      const web3 = getWeb3NoAccount()
      const currentBlockNumber = await web3.eth.getBlockNumber()
      setCurrentBlock(currentBlockNumber)
    }

    fetchCurrentBlock()
  }, [blockNumber, setCurrentBlock])

  // Step 2 - Start the countdown when we have successfully fetched the current block
  useEffect(() => {
    // Only start the countdown if the block given is in the future
    if (currentBlock !== null && blockNumber > currentBlock) {
      setSecondsRemaining((blockNumber - currentBlock) * BSC_BLOCK_TIME)

      timer.current = setInterval(() => {
        setSecondsRemaining((prevSecondsRemaining) => prevSecondsRemaining - 1)
      }, 1000)
    }

    return () => {
      clearInterval(timer.current)
    }
  }, [timer, blockNumber, currentBlock, setSecondsRemaining])

  return getTimePeriods(secondsRemaining)
}

export default useBlockCountdown
