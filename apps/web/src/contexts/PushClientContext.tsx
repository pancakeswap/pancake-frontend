import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DappClient } from '@walletconnect/push-client'
import { Connector, useAccount } from 'wagmi'

interface IContext {
  connector: Connector<any, any>
  account: `0x${string}`
  pushClient: DappClient
  handleSendTestNotification: () => Promise<void>
}

export const PushClientContext = createContext<IContext>({} as IContext)

export function PushClientContextProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const { connector, address: account } = useAccount()
  const [pushClient, setPushClient] = useState<DappClient>()

  const createClient = useCallback(async () => {
    const provider = await connector?.getProvider()
    if (provider) setPushClient(provider.pushClient)
  }, [connector])

  const handleSendTestNotification = useCallback(async () => {
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }

      const notificationPayload ={
        account,
        type: "Liquidity Notification",
          title: "Liquidity Position Added",
          description: "Successfylly added liquidity to GOR-tUSDC Pair for 0.0001 GOR-ETH and 206.683 tUSDC"
      }

      await await fetch(`http://localhost:8000/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationPayload),
      })
    } catch (error) {
      console.error({ sendGmError: error })
    }
  }, [ account, pushClient])

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
      createClient,
      handleSendTestNotification
    }),
    [connector, account, pushClient, createClient, handleSendTestNotification],
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
