import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { DappClient } from '@walletconnect/push-client'
import { Connector, useAccount } from 'wagmi'

export const DEFAULT_APP_METADATA = {
  description: 'A simple gm notification dApp',
  icons: ['https://i.imgur.com/q9QDRXc.png'],
  name: 'gm-dApp',
  url: 'https://gm.walletconnect.com',
}
interface IContext {
  connector: Connector<any, any>
  account: `0x${string}`
  pushClient: DappClient
}

export const PushClientContext = createContext<IContext>({} as IContext)

export function PushClientContextProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const { connector, address: account } = useAccount()
  const [pushClient, setPushClient] = useState<DappClient>()

  const createClient = useCallback(async () => {
    const provider = await connector?.getProvider()
    if (provider) setPushClient(provider.pushClient)
  }, [connector])

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
    }),
    [connector, account, pushClient],
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
