import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Yam } from '../../sushi'

export interface YamContext {
  yam?: typeof Yam
}

export const Context = createContext<YamContext>({
  yam: undefined,
})

declare global {
  interface Window {
    yamsauce: any
  }
}

const YamProvider: React.FC = ({ children }) => {
  const { ethereum }: { ethereum: any } = useWallet()
  const [yam, setYam] = useState<any>()

  // @ts-ignore
  window.yam = yam
  // @ts-ignore
  window.eth = ethereum

  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId)
      const yamLib = new Yam(ethereum, chainId, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 10000,
      })
      setYam(yamLib)
      window.yamsauce = yamLib
    }
  }, [ethereum])

  return <Context.Provider value={{ yam }}>{children}</Context.Provider>
}

export default YamProvider
