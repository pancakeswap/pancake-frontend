import { useCallback, useEffect, useState } from 'react'
import Web3 from 'web3'
import { provider } from 'web3-core'
import { useWallet } from 'use-wallet'
// import debounce from 'debounce'

const useBlock = () => {
  const [block, setBlock] = useState(0)
  const { ethereum }: { ethereum: provider } = useWallet()

  useEffect(() => {
    // const setBlockDebounced = debounce(setBlock, 300)
    if (!ethereum) return
    const web3 = new Web3(ethereum)

    // const subscription = new Web3(ethereum).eth.subscribe(
    //   'newBlockHeaders',
    //   (error, result) => {
    //     if (!error) {
    //       setBlockDebounced(result.number)
    //     }
    //   },
    // )

    const interval = setInterval(async () => {
      const latestBlockNumber = await web3.eth.getBlockNumber()
      if (block !== latestBlockNumber) {
        setBlock(latestBlockNumber)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [ethereum])

  return block
}

export default useBlock
