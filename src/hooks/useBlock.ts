import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import { provider } from 'web3-core'

const useBlock = () => {
  const [block, setBlock] = useState(0)
  const { ethereum }: { ethereum: provider } = useWallet()

  useEffect(() => {
    let interval = null
    if (ethereum) {
      const web3 = new Web3(ethereum)

      interval = setInterval(async () => {
        const latestBlockNumber = await web3.eth.getBlockNumber()
        setBlock(latestBlockNumber)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [ethereum])

  return block
}

export default useBlock
