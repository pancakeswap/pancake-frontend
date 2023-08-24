'use client'

import { NotifyClientTypes } from '@walletconnect/notify-client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { DEFAULT_PROJECT_ID } from 'views/Notifications/constants'
import PushClientProxy, { PushClient } from 'PushNotificationClient'
import { useAccount } from 'wagmi'

interface PushClientContext {
  refreshNotifications: () => void
  activeSubscriptions: NotifyClientTypes.NotifySubscription[]
  userPubkey?: string
  pushClientProxy: PushClient | null
  pushRegisteredKey: string | null
  pushRegisterMessage: string | null
  isSubscribed: boolean
  isOnBoarded: boolean
  unread: number
  setUnread: React.Dispatch<React.SetStateAction<number>>
}

export const PushClientContext = createContext<PushClientContext>({} as PushClientContext)

interface PushContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const PushContextProvider: React.FC<PushContextProviderProps> = ({ children }) => {
  const { address: userPubkey } = useAccount()

  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [unread, setUnread] = useState<number>(0)
  const [isOnBoarded, setIsOnBoarded] = useState<boolean>(false)
  const [activeSubscriptions, setActiveSubscriptions] = useState<NotifyClientTypes.NotifySubscription[]>([])

  const [pushRegisterMessage, setRegisterMessage] = useState<string | null>(null)
  const [pushRegisteredKey, setRegistered] = useState<string | null>(null)

  const [pushClient, setPushClient] = useState<PushClient | null>(null)

  const relayUrl = 'wss://relay.walletconnect.com'
  const projectId = DEFAULT_PROJECT_ID

  const [proxyReady, setProxyReady] = useState(false)
  const [w3iProxy] = useState(PushClientProxy.getProxy(projectId, relayUrl))

  useEffect(() => {
    w3iProxy.init().then(() => setProxyReady(true))
  }, [w3iProxy, setProxyReady])

  useEffect(() => {
    if (proxyReady) {
      setPushClient(w3iProxy.notify)
    }
  }, [w3iProxy, proxyReady])

  useEffect(() => {
    const pushSignatureRequired = !pushRegisteredKey && pushRegisterMessage
    if (userPubkey && pushSignatureRequired) setIsOnBoarded(false)
    else setIsOnBoarded(true)
  }, [userPubkey, pushRegisteredKey, pushRegisterMessage])

  const refreshPushState = useCallback(() => {
    if (!pushClient || !userPubkey) {
      return
    }

    pushClient.getActiveSubscriptions({ account: `eip155:1:${userPubkey}` }).then((subscriptions) => {
      setActiveSubscriptions(Object.values(subscriptions))
      if (Object.values(subscriptions).some((sub) => sub.account === `eip155:1:${userPubkey}`)) {
        setIsSubscribed(true)
      } else setIsSubscribed(false)
    })
  }, [pushClient, userPubkey])

  useEffect(() => {
    // Account for sync init
    const timeoutId = setTimeout(() => refreshPushState(), 100)

    return () => clearTimeout(timeoutId)
  }, [refreshPushState])

  const handleRegistration = useCallback(
    async (key: string) => {
      console.log(pushClient && key)
      if (pushClient && key) {
        try {
          const identityKey = await pushClient.register({ account: `eip155:1:${key}` })
          console.log('yooooooooooooooooooooooooo')
          setRegisterMessage(null)
          setRegistered(identityKey)
          refreshPushState()
        } catch (error) {
          setRegisterMessage(null)
        }
      }
    },
    [pushClient, refreshPushState, setRegisterMessage],
  )

  useEffect(() => {
    if (userPubkey) {
      handleRegistration(userPubkey)
    } else {
      setRegisterMessage(null)
    }
  }, [handleRegistration, setRegisterMessage, userPubkey])

  useEffect(() => {
    if (!pushClient) {
      return () => null
    }

    const handleNotificationEvent = async () => {
      refreshPushState()
      setUnread((prev) => prev + 1)
    }

    pushClient.emitter.on('notify_signature_requested', ({ message }) => setRegisterMessage(message))
    pushClient.emitter.on('notify_signature_request_cancelled', () => setRegisterMessage(null))

    pushClient.emitter.on('notify_subscription', () => refreshPushState)
    pushClient.emitter.on('notify_delete', () => refreshPushState)
    pushClient.emitter.on('notify_update', () => refreshPushState)
    pushClient.emitter.on('notify_update', () => refreshPushState)
    pushClient.emitter.on('notify_message', () => handleNotificationEvent)

    return () => {
      pushClient.emitter.off('notify_subscription', () => refreshPushState)
      pushClient.emitter.off('notify_delete', () => refreshPushState)
      pushClient.emitter.off('notify_update', () => refreshPushState)
      pushClient.emitter.off('notify_update', () => refreshPushState)
      pushClient.emitter.off('notify_message', () => handleNotificationEvent)
      pushClient.emitter.off('notify_signature_requested', ({ message }) => setRegisterMessage(message))
      pushClient.emitter.off('notify_signature_request_cancelled', () => setRegisterMessage(null))
    }
  }, [pushClient, refreshPushState])

  return (
    <PushClientContext.Provider
      value={{
        userPubkey,
        refreshNotifications: refreshPushState,
        activeSubscriptions,
        pushRegisteredKey,
        pushRegisterMessage,
        pushClientProxy: pushClient,
        isSubscribed,
        isOnBoarded,
        unread,
        setUnread,
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
