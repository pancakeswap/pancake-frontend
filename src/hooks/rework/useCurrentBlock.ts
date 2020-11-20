import { useEffect, useRef, useState } from 'react'
import useWeb3 from './useWeb3'

const useCurrentBlock = () => {
  const previousBlock = useRef(0)
  const [block, setBlock] = useState(0)
  const web3 = useWeb3()

  useEffect(() => {
    let interval = null
    if (web3) {
      interval = setInterval(async () => {
        const blockNumber = await web3.eth.getBlockNumber()
        if (blockNumber !== previousBlock.current) {
          previousBlock.current = blockNumber
          setBlock(blockNumber)
        }
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [setBlock, web3, previousBlock])

  return block
}

export default useCurrentBlock
