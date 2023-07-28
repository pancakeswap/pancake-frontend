import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { providers } from 'ethers'
import { DappClient } from '@walletconnect/push-client'
import { Connector, useAccount } from 'wagmi'

interface IContext {
  connector: Connector<any, any>
  account: `0x${string}`
  pushClient: DappClient
  testSendTransaction: (tx: any) => Promise<{
    hash: any
  }>
}

export const PushClientContext = createContext<IContext>({} as IContext)

export function PushClientContextProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const { connector, address: account } = useAccount()
  const [pushClient, setPushClient] = useState<DappClient>()
  const [web3Provider, setWeb3Provider] = useState<providers.Web3Provider>()

  const createClient = useCallback(async () => {
    const provider = await connector?.getProvider()
    if (provider) {
      setPushClient(provider.pushClient)
      setWeb3Provider(new providers.Web3Provider(provider))
    }
  }, [connector])

  const testSendTransaction = useCallback(
    async (tx) => {
      if (!web3Provider || !connector) {
        throw new Error('web3Provider not connected')
      }
      const signer = await connector?.getProvider()
      const receipt = await signer.request({
        method: 'eth_sendTransaction',
        params: [tx],
      })
      return { hash: receipt }
    },
    [connector, web3Provider],
  )

  useEffect(() => {
    if (!pushClient && connector) {
      createClient()
    }
  }, [pushClient, createClient, connector])

  const value = useMemo(
    () => ({
      connector,
      account,
      pushClient,
      testSendTransaction,
      createClient,
    }),
    [connector, account, pushClient, testSendTransaction, createClient],
  )

  return (
    <PushClientContext.Provider
      value={{
        ...value,
      }}
    >
      {children}
    </PushClientContext.Provider>
  )
}

export function useWalletConnectPushClient() {
  const context = useContext(PushClientContext)
  if (context === undefined) {
    throw new Error('useWalletConnectPushClient must be used within a PushClientContextProvider')
  }
  return context
}
