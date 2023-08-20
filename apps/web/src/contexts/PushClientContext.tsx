'use client'

import { PushClientTypes } from '@walletconnect/push-client'
import { ISyncClient } from '@walletconnect/sync-client'
import EventEmitter from 'events'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Web3InboxProxy, { PushClient } from 'state/PushClientProxy'
import useFormattedEip155Account from 'views/Notifications/components/hooks/useFormatEip155Account'
import { DEFAULT_PROJECT_ID } from 'views/Notifications/constants'

interface PushClientContext {
  refreshNotifications: () => void
  activeSubscriptions: PushClientTypes.PushSubscription[]
  userPubkey?: string
  pushClientProxy: PushClient | null
  setUnread: React.Dispatch<React.SetStateAction<number>>
  unread: number
  handleRegistration: (key: string, isOnLoad: any) => Promise<void>
  isSubscribed: boolean
  isOnBoarded: boolean
}

export const PushClientContext = createContext<PushClientContext>({} as PushClientContext)

interface PushContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const PushContextProvider: React.FC<PushContextProviderProps> = ({ children }) => {
  const [activeSubscriptions, setActiveSubscriptions] = useState<PushClientTypes.PushSubscription[]>([])
  const [unread, setUnread] = useState<number>(0)
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [isOnBoarded, setIsOnBoarded] = useState<boolean>(false)
  const [pushClient, setPushClient] = useState<PushClient | null>(null)
  const [syncClient, setSyncClient] = useState<ISyncClient | null>(null)
  const [emitter] = useState(new EventEmitter())
  const [w3iProxy] = useState(Web3InboxProxy.getProxy(DEFAULT_PROJECT_ID, 'wss://relay.walletconnect.com'))
  const { eip155Account, account: userPubkey } = useFormattedEip155Account()

  const refreshPushState = useCallback(() => {
    if (!pushClient || !userPubkey || !syncClient) return

    pushClient.getActiveSubscriptions().then((subscriptions) => {
      const _activeSubscriptions = Object.values(subscriptions)
      const isSynced = syncClient.signatures.getAll({ account: userPubkey }).length > 0
      setActiveSubscriptions(_activeSubscriptions)
      if (_activeSubscriptions.some((sub) => sub.account === eip155Account)) {
        setIsSubscribed(true)
      } else setIsSubscribed(false)

      if (isSynced) setIsOnBoarded(true)
      else setIsOnBoarded(false)
    })
  }, [pushClient, eip155Account, userPubkey, setIsSubscribed, syncClient, setIsOnBoarded, setActiveSubscriptions])

  const handleRegistration = useCallback(
    async (key: string, isOnLoad) => {
      if (pushClient && key) {
        try {
          if (isOnLoad) await pushClient.enablePresistantSync({ account: key })
          else await pushClient.enableSync({ account: key })

          refreshPushState()
        } catch (error) {
          throw new Error(`Push client sync registration failed`)
        }
      }
    },
    [pushClient, refreshPushState],
  )

  useEffect(() => {
    w3iProxy.init().then(() => {
      setPushClient(w3iProxy.push)
      setSyncClient(w3iProxy.push.pushClient.syncClient)
    })
  }, [w3iProxy, setPushClient, setSyncClient])

  useEffect(() => {
    if (eip155Account) handleRegistration(eip155Account, true)
  }, [handleRegistration, eip155Account])

  useEffect(() => {
    refreshPushState()
    const intervalId = setInterval(refreshPushState, 30000) // 30 seconds
    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId)
    }
  }, [refreshPushState])

  useEffect(() => {
    if (!pushClient) return () => null

    const handleNotificationEvent = async () => {
      refreshPushState()
      setUnread((prev) => prev + 1)
    }

    pushClient.emitter.on('push_subscription', () => refreshPushState)
    pushClient.emitter.on('push_delete', refreshPushState)
    pushClient.emitter.on('push_update', refreshPushState)
    pushClient.emitter.on('sync_update', refreshPushState)
    pushClient.emitter.on('push_message', handleNotificationEvent)

    return () => {
      pushClient.emitter.off('push_subscription', refreshPushState)
      pushClient.emitter.off('push_delete', refreshPushState)
      pushClient.emitter.off('push_update', refreshPushState)
      pushClient.emitter.off('sync_update', refreshPushState)
      pushClient.emitter.off('push_message', handleNotificationEvent)
    }
  }, [pushClient, refreshPushState, emitter])

  return (
    <PushClientContext.Provider
      value={{
        userPubkey,
        refreshNotifications: refreshPushState,
        activeSubscriptions,
        pushClientProxy: pushClient,
        setUnread,
        unread,
        handleRegistration,
        isSubscribed,
        isOnBoarded,
      }}
    >
      {children}
    </PushClientContext.Provider>
  )
}

export function usePushClient() {
  const context = useContext(PushClientContext)
  if (context === undefined) {
    throw new Error('useWalletConnectPushClient must be used within a PushClientContextProvider')
  }
  return context
}

export default PushContextProvider
