import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BnInjectedConnector } from './BnInjectedConnector'

const injected = new BnInjectedConnector({ supportedChainIds: [56, 97] })

export const useEagerConnect = () => {
  const { activate } = useWeb3React()

  useEffect(() => {
    setTimeout(() => {
      activate(injected, (error) => {
        console.log('🚀 ~ file: useEagerConnect.ts ~ line 13 ~ activate ~ error', error)
      })
    }, 1000 * 3)
  }, [activate])
}
