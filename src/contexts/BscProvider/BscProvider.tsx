import React, { createContext, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import { provider } from 'web3-core'

export interface BscContext {
  block: number
}

export const Context = createContext<BscContext>({
  block: 0,
})

const BscProvider: React.FC = ({ children }) => {
  const [block, setBlock] = useState(0)
  const { ethereum }: { ethereum: provider } = useWallet()

  useEffect(() => {
    if (!ethereum) return
    const web3 = new Web3(ethereum)

    const interval = setInterval(async () => {
      const latestBlockNumber = await web3.eth.getBlockNumber()
      setBlock(latestBlockNumber)
    }, 1000)

    return () => clearInterval(interval)
  }, [ethereum])

  return <Context.Provider value={{ block }}>{children}</Context.Provider>
}

export default BscProvider
