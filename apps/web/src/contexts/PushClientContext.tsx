import type { PushClientTypes } from '@walletconnect/push-client'
import { EventEmitter } from 'events'
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react'

import { Core } from '@walletconnect/core'
import { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import { WalletClient } from '@walletconnect/push-client'
import { SyncClient, SyncStore } from '@walletconnect/sync-client'
import useSendPushNotification from 'views/Notifications/components/hooks/sendPushNotification'
import useFormattedEip155Account from 'views/Notifications/components/hooks/useFormatEip155Account'
import { BuilderNames } from 'views/Notifications/types'
import { useSignMessage } from 'wagmi'
import { DEFAULT_PROJECT_ID } from 'views/Notifications/constants'

interface IContext {
  activeSubscriptions: PushClientTypes.PushSubscription[]
  registerMessage: string
  pushClient: WalletClient
  refreshPushState: () => void
  getMessageHistory: (params: { topic: string }) => Promise<Record<number, PushClientTypes.PushMessageRecord>>
  subscribe: (params: { metadata: PushClientTypes.Metadata; account: string }) => Promise<{
    id: number
    subscriptionAuth: string
  }>
  deleteSubscription: (params: { topic: string }) => Promise<void>
  deletePushMessage: (params: { id: number }) => Promise<void>
  setUnread: React.Dispatch<React.SetStateAction<number>>
  unread: number
  postMessage: (messageData: JsonRpcRequest<unknown>) => void
  setCurrentSubscribtion: React.Dispatch<React.SetStateAction<PushClientTypes.PushSubscription | null>>
  currentSubscription: PushClientTypes.PushSubscription | null
}

const core = new Core({
  logger: 'debug',
  projectId: DEFAULT_PROJECT_ID,
})

export const PushClientContext = createContext<IContext>({} as IContext)

export function PushClientContextProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const [activeSubscriptions, setActiveSubscriptions] = useState<PushClientTypes.PushSubscription[]>([])
  const [currentSubscription, setCurrentSubscribtion] = useState({} as PushClientTypes.PushSubscription)
  const [emitter] = useState(new EventEmitter())
  const [registerMessage, setRegisterMessage] = useState<string | null>(null)
  const [pushClient, setPushClient] = useState<WalletClient | null>(null)
  const [unread, setUnread] = useState<number>(0)

  const { formattedEip155Account: userPublicKey } = useFormattedEip155Account()
  const { signMessageAsync } = useSignMessage()
  const { sendPushNotification } = useSendPushNotification()

  const createClient = useCallback(async () => {
    const syncClient = await SyncClient.init({
      core,
      projectId: DEFAULT_PROJECT_ID,
    })
    const _pushClient = await WalletClient.init({
      core,
      syncClient,
      SyncStoreController: SyncStore,
      logger: 'info',
    })
    setPushClient(_pushClient)
  }, [])

  const formatClientRelatedError = (method: string) => {
    return `An initialized PushClient is required for method: [${method}].`
  }

  const subscribe = useCallback(
    async (params: { metadata: PushClientTypes.Metadata; account: string }) => {
      if (!pushClient) {
        throw new Error(formatClientRelatedError('subscribe'))
      }
      const subscribed = await pushClient.subscribe({
        ...params,
        onSign: async (message) =>
          signMessageAsync({ message }).then((signature) => {
            return signature
          }),
      })
      return subscribed
    },
    [pushClient, signMessageAsync],
  )

  const deleteSubscription = useCallback(
    async (params: { topic: string }) => {
      if (!pushClient) {
        throw new Error(formatClientRelatedError('deleteSubscription'))
      }
      return pushClient.deleteSubscription(params).then(() => {
        emitter.emit('push_delete', {})
      })
    },
    [pushClient, emitter],
  )

  const getActiveSubscriptions = useCallback(
    async (params?: { account: string }) => {
      if (!pushClient) {
        throw new Error(formatClientRelatedError('activeSubscriptions'))
      }
      const subscriptions = pushClient.getActiveSubscriptions(params)
      return Promise.resolve(subscriptions)
    },
    [pushClient],
  )

  const getMessageHistory = useCallback(
    async (params: { topic: string }) => {
      if (!pushClient) {
        throw new Error(formatClientRelatedError('subscribe'))
      }
      const messages = pushClient.getMessageHistory(params)
      return Promise.resolve(messages)
    },
    [pushClient],
  )

  const deletePushMessage = useCallback(
    async (params: { id: number }) => {
      if (!pushClient) {
        throw new Error(formatClientRelatedError('deleteMesssage'))
      }
      pushClient.deletePushMessage(params)
      return Promise.resolve()
    },
    [pushClient],
  )

  const refreshPushState = useCallback(() => {
    if (!pushClient) return

    getActiveSubscriptions({ account: userPublicKey }).then((subscriptions) => {
      setActiveSubscriptions(Object.values(subscriptions))
      const _currentSubscription = Object.values(subscriptions).find((sub) => sub.account === userPublicKey)
      if (_currentSubscription) setCurrentSubscribtion(_currentSubscription)
    })
  }, [pushClient, getActiveSubscriptions, userPublicKey])

  useEffect(() => {
    if (!pushClient) createClient()
  }, [pushClient, createClient])

  useEffect(() => {
    refreshPushState()
  }, [refreshPushState])

  const handleMessage = async (request: JsonRpcRequest<unknown>) => {
    switch (request.method) {
      case 'push_signature_delivered':
        emitter.emit('push_signature_delivered', request.params)
        break
      default:
        throw new Error(`Method ${request.method} unsupported by provider`)
    }
  }

  const postMessage = (messageData: JsonRpcRequest<unknown>) => {
    emitter.emit(messageData.id.toString(), messageData)
    handleMessage(messageData)
  }

  const handleRegistration = useCallback(
    async (key: string) => {
      if (!pushClient || !key) return

      const alreadySynced = pushClient.syncClient.signatures.getAll({
        account: key,
      }).length

      // eslint-disable-next-line consistent-return
      if (alreadySynced) return Promise.resolve()
      try {
        await pushClient.enableSync({
          account: key,
          onSign: async (message) => {
            emitter.emit('push_signature_requested', { message })

            return new Promise((resolve) => {
              const intervalId = setInterval(() => {
                const signatureForAccountExists = pushClient?.syncClient.signatures.getAll({
                  account: key,
                })?.length
                if (pushClient && signatureForAccountExists) {
                  const { signature } = pushClient.syncClient.signatures.get(key)
                  emitter.emit('push_signature_request_cancelled', {})
                  clearInterval(intervalId)
                  resolve(signature)
                }
              }, 1000)

              emitter.on('push_signature_delivered', ({ signature }: { signature: string }) => {
                resolve(signature)
              })
            })
          },
        })
        setRegisterMessage(null)
        refreshPushState()
      } catch (error) {
        setRegisterMessage(null)
      }
    },
    [pushClient, refreshPushState, setRegisterMessage, emitter],
  )

  useEffect(() => {
    if (userPublicKey) handleRegistration(userPublicKey)
    else setRegisterMessage(null)
  }, [handleRegistration, setRegisterMessage, userPublicKey])

  useEffect(() => {
    if (!pushClient) return

    const handlePushSubscription = async () => {
      await sendPushNotification(BuilderNames.OnBoardNotification, [])
      refreshPushState()
    }

    const handlePushClientEvent = async () => {
      refreshPushState()
    }

    const handleNotificationEvent = async () => {
      refreshPushState()
      setUnread((prev) => prev + 1)
    }

    emitter.on('push_signature_request_cancelled', () => setRegisterMessage(null))
    pushClient.on('push_subscription', handlePushSubscription)
    pushClient.on('push_response', handlePushSubscription)
    pushClient.on('push_delete', handlePushClientEvent)
    pushClient.on('push_update', handlePushClientEvent)
    pushClient.on('push_message', handleNotificationEvent)
    pushClient.syncClient.on('sync_update', handlePushClientEvent)
    pushClient.subscriptions.core.on('sync_store_update', handlePushClientEvent)
    emitter.on('push_signature_requested', ({ message }) => {
      setRegisterMessage(message)
    })
    // eslint-disable-next-line consistent-return
    return () => {
      pushClient.off('push_subscription', handlePushSubscription)
      pushClient.off('push_response', handlePushSubscription)
      pushClient.off('push_delete', handlePushClientEvent)
      pushClient.off('push_update', handlePushClientEvent)
      pushClient.off('push_message', handleNotificationEvent)
      pushClient.syncClient.off('sync_update', handlePushClientEvent)
      pushClient.subscriptions.core.off('sync_store_update', handlePushClientEvent)
      emitter.off('push_signature_request_cancelled', () => setRegisterMessage(null))
      emitter.off('push_signature_requested', ({ message }) => {
        setRegisterMessage(message)
      })
    }
  }, [pushClient, refreshPushState, emitter, sendPushNotification])

  return (
    <PushClientContext.Provider
      value={{
        activeSubscriptions,
        registerMessage,
        pushClient,
        refreshPushState,
        getMessageHistory,
        subscribe,
        deleteSubscription,
        deletePushMessage,
        setUnread,
        unread,
        postMessage,
        currentSubscription,
        setCurrentSubscribtion,
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
