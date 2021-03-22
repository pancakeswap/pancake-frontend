import { BSC_BLOCK_TIME } from 'config'
import { useEffect, useState } from 'react'
import { getWeb3NoAccount } from 'utils/web3'

/**
 * Returns the difference of blocks and estimated seconds
 */
const useBlockCountdown = (blockNumber: number) => {
  const [baseBlock, setBaseBlock] = useState(null)
  const [secondsRemaining, setSecondsRemaining] = useState(0)

  // Step 1 - Fetch current block
  useEffect(() => {
    const fetchCurrentBlock = async () => {
      const web3 = getWeb3NoAccount()
      const currentBlockNumber = await web3.eth.getBlockNumber()
      setSecondsRemaining((blockNumber - currentBlockNumber) * BSC_BLOCK_TIME)
      setBaseBlock(currentBlockNumber)
    }

    fetchCurrentBlock()
  }, [blockNumber, setBaseBlock])

  // Step 2 - Start the timer when we have established a base block
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> = null

    if (baseBlock !== null && blockNumber >= baseBlock) {
      timer = setInterval(() => {
        setSecondsRemaining((prevSecondsRemaining) => prevSecondsRemaining - 1)
      }, 1000)
    }

    return () => {
      clearInterval(timer)
    }
  }, [baseBlock, blockNumber, setSecondsRemaining])

  return secondsRemaining
}

export default useBlockCountdown
