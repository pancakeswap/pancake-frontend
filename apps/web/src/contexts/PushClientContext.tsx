'use client'

import { NotifyClientTypes } from '@walletconnect/notify-client'
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { DEFAULT_PROJECT_ID } from 'views/Notifications/constants'
import PushClientProxy, { PushClient } from 'PushNotificationClient'
import useFormattedEip155Account from 'views/Notifications/components/hooks/useFormatEip155Account'

interface PushClientContext {
  refreshNotifications: () => void
  activeSubscriptions: NotifyClientTypes.NotifySubscription[]
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
  const { eip155Account } = useFormattedEip155Account()
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [unread, setUnread] = useState<number>(0)
  const [isOnBoarded, setIsOnBoarded] = useState<boolean>(false)
  const [activeSubscriptions, setActiveSubscriptions] = useState<NotifyClientTypes.NotifySubscription[]>([])

  const [pushRegisterMessage, setRegisterMessage] = useState<string | null>(null)
  const [pushRegisteredKey, setRegistered] = useState<string | null>(null)

  const [pushClient, setPushClient] = useState<PushClient | null>(null)
  const [proxyReady, setProxyReady] = useState(false)
  const [pushClientProxy] = useState(new PushClientProxy(DEFAULT_PROJECT_ID, 'wss://relay.walletconnect.com'))

  useEffect(() => {
    pushClientProxy.init().then(() => setProxyReady(true))
  }, [pushClientProxy, setProxyReady])

  useEffect(() => {
    if (proxyReady) {
      setPushClient(pushClientProxy.notify)
    }
  }, [pushClientProxy, proxyReady])

  useEffect(() => {
    const pushSignatureRequired = !pushRegisteredKey && pushRegisterMessage
    if (eip155Account && pushSignatureRequired) setIsOnBoarded(false)
    else setIsOnBoarded(true)
  }, [eip155Account, pushRegisteredKey, pushRegisterMessage])

  const refreshPushState = useCallback(() => {
    if (!pushClient || !eip155Account) {
      return
    }

    pushClient.getActiveSubscriptions({ account: eip155Account }).then((subscriptions) => {
      setActiveSubscriptions(Object.values(subscriptions))
      if (Object.values(subscriptions).some((sub) => sub.account === eip155Account)) {
        setIsSubscribed(true)
      } else setIsSubscribed(false)
    })
  }, [pushClient, eip155Account])

  useEffect(() => {
    // refresh on acccount sync then every 60s
    const timeoutId = setTimeout(() => refreshPushState(), 5000)
    const intervalId: NodeJS.Timer = setInterval(refreshPushState, 60000)
    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [refreshPushState])

  const handleRegistration = useCallback(
    async (key: string) => {
      if (pushClient && key) {
        try {
          const identityKey = await pushClient.register({ account: key })
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
    if (eip155Account) {
      handleRegistration(eip155Account)
    } else {
      setRegisterMessage(null)
    }
  }, [handleRegistration, setRegisterMessage, eip155Account])

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

    pushClient.emitter.on('notify_subscription', () => refreshPushState())
    pushClient.emitter.on('notify_delete', () => refreshPushState())
    pushClient.emitter.on('notify_update', () => refreshPushState())
    pushClient.emitter.on('notify_update', () => refreshPushState())
    pushClient.emitter.on('notify_message', () => handleNotificationEvent())

    return () => {
      pushClient.emitter.off('notify_subscription', () => refreshPushState())
      pushClient.emitter.off('notify_delete', () => refreshPushState())
      pushClient.emitter.off('notify_update', () => refreshPushState())
      pushClient.emitter.off('notify_update', () => refreshPushState())
      pushClient.emitter.off('notify_message', () => handleNotificationEvent())
      pushClient.emitter.off('notify_signature_requested', ({ message }) => setRegisterMessage(message))
      pushClient.emitter.off('notify_signature_request_cancelled', () => setRegisterMessage(null))
    }
  }, [pushClient, refreshPushState])

  return (
    <PushClientContext.Provider
      value={{
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
