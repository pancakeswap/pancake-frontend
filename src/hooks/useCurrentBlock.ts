import { useEffect, useRef, useState } from 'react'
import useWeb3 from './useWeb3'

const useCurrentBlock = () => {
  const previousBlock = useRef(0)
  const [block, setBlock] = useState(0)
  const web3 = useWeb3()

  useEffect(() => {
    const subscription = web3.eth.subscribe('newBlockHeaders', (error, result) => {
      if (!error) {
        if (result.number !== previousBlock.current) {
          previousBlock.current = result.number
          setBlock(result.number)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [setBlock, web3, previousBlock])

  return block
}

export default useCurrentBlock
