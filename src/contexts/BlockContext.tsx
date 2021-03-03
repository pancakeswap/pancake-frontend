import React, { useState, useEffect, useRef } from 'react'
import { getWeb3NoAccount } from 'utils/web3'

const BlockContext = React.createContext(0)

const BlockContextProvider = ({ children }) => {
  const previousBlock = useRef(0)
  const [block, setBlock] = useState(0)

  useEffect(() => {
    const web3 = getWeb3NoAccount()
    const interval = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber()
      if (blockNumber !== previousBlock.current) {
        previousBlock.current = blockNumber
        setBlock(blockNumber)
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  return <BlockContext.Provider value={block}>{children}</BlockContext.Provider>
}

export { BlockContext, BlockContextProvider }
