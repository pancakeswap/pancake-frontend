import type { PushClientTypes } from '@walletconnect/push-client'
import { EventEmitter } from 'events'
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from 'react'

import { Core } from '@walletconnect/core'
import { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import { WalletClient } from '@walletconnect/push-client'
import { SyncClient, SyncStore } from '@walletconnect/sync-client'
import { useAccount, useChainId, useSignMessage } from 'wagmi'

interface IContext {
  activeSubscriptions: PushClientTypes.PushSubscription[]
  registerMessage: string
  pushClient: WalletClient
  refreshPushState: () => void
  account: string
  getMessageHistory: (params: { topic: string }) => Promise<Record<number, PushClientTypes.PushMessageRecord>>
  reject: (params: { id: number; reason: string }) => Promise<void>
  subscribe: (params: { metadata: PushClientTypes.Metadata; account: string }) => Promise<{
    id: number
    subscriptionAuth: string
  }>
  update: (params: { topic: string; scope: string[] }) => Promise<boolean>
  deleteSubscription: (params: { topic: string }) => Promise<void>
  deletePushMessage: (params: { id: number }) => Promise<void>
  setUnread: React.Dispatch<React.SetStateAction<number>>
  unread: number
  postMessage: (messageData: JsonRpcRequest<unknown>) => void
}

const core = new Core({
  projectId: 'ae5413feaf0cdaee02910dc807e03203',
})

export const PushClientContext = createContext<IContext>({} as IContext)

export function PushClientContextProvider({ children }: { children: ReactNode | ReactNode[] }) {
  const [activeSubscriptions, setActiveSubscriptions] = useState<PushClientTypes.PushSubscription[]>([])
  const [emitter] = useState(new EventEmitter())
  const [registerMessage, setRegisterMessage] = useState<string | null>(null)
  const [pushClient, setPushClient] = useState<WalletClient | null>(null)
  const [unread, setUnread] = useState<number>(0)
  const chainId = useChainId()
  const { address: account } = useAccount()
  const { signMessageAsync } = useSignMessage()

  const createClient = useCallback(async () => {
    const syncClient = await SyncClient.init({
      core,
      projectId: 'ae5413feaf0cdaee02910dc807e03203',
    })
    const _pushClient = await WalletClient.init({
      core,
      syncClient,
      SyncStoreController: SyncStore,
    })
    setPushClient(_pushClient)
  }, [])

  const formatClientRelatedError = (method: string) => {
    return `An initialized PushClient is required for method: [${method}].`
  }
  const reject = useCallback(
    async (params: { id: number; reason: string }) => {
      if (!pushClient) {
        throw new Error(formatClientRelatedError('reject'))
      }
      return pushClient.reject(params)
    },
    [pushClient],
  )

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

  const update = useCallback(
    async (params: { topic: string; scope: string[] }) => {
      if (!pushClient) {
        throw new Error(formatClientRelatedError('subscribe'))
      }
      const updated = await pushClient.update(params)
      return updated
    },
    [pushClient],
  )

  const deleteSubscription = useCallback(
    async (params: { topic: string }) => {
      if (!pushClient) {
        throw new Error(formatClientRelatedError('subscribe'))
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
        throw new Error(formatClientRelatedError('subscribe'))
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
        throw new Error(formatClientRelatedError('subscribe'))
      }
      pushClient.deletePushMessage(params)
      return Promise.resolve()
    },
    [pushClient],
  )

  useEffect(() => {
    if (!pushClient) {
      createClient()
    }
  }, [pushClient, createClient])

  const refreshPushState = useCallback(() => {
    if (!pushClient) {
      return
    }

    getActiveSubscriptions().then((subscriptions) => {
      setActiveSubscriptions(Object.values(subscriptions))
    })
  }, [pushClient, getActiveSubscriptions])

  const SendTestOnboardNotification = useCallback(async () => {
    try {
      if (!pushClient) {
        throw new Error('Push Client not initialized')
      }

      const notificationPayload2 = {
        accounts: [`eip155:${chainId}:${account}`],
        notification: {
          title: 'Welcome',
          body: 'You have successfully joined Pancake Notifications Yaaaay!',
          icon: `${window.location.href}logo.png`,
          url: 'https://pc-custom-web.vercel.app',
          type: 'alerts',
        },
      }

      await fetch(`https://cast.walletconnect.com/${'ae5413feaf0cdaee02910dc807e03203'}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${'85a7792c-c5d7-486b-b37e-e752918e4866'}`,
        },
        body: JSON.stringify(notificationPayload2),
      })
    } catch (error) {
      console.error({ sendGmError: error })
    }
  }, [pushClient, chainId, account])

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

  // Method to be used by external providers. Not internal use.
  const postMessage = (messageData: JsonRpcRequest<unknown>) => {
    emitter.emit(messageData.id.toString(), messageData)
    handleMessage(messageData)
  }

  const handleRegistration = useCallback(
    async (key: string) => {
      if (pushClient && key) {
        try {
          await pushClient.enableSync({
            account: `eip155:${chainId}:${key}`,
            onSign: async (message) => {
              emitter.emit('push_signature_requested', { message })

              return new Promise((resolve) => {
                const intervalId = setInterval(() => {
                  const signatureForAccountExists = pushClient?.syncClient.signatures.getAll({
                    account: `eip155:${chainId}:${key}`,
                  })?.length
                  if (pushClient && signatureForAccountExists) {
                    const { signature } = pushClient.syncClient.signatures.get(`eip155:${chainId}:${key}`)
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
      }
    },
    [pushClient, refreshPushState, setRegisterMessage, emitter, chainId],
  )

  useEffect(() => {
    if (account) {
      handleRegistration(account)
    } else {
      setRegisterMessage(null)
    }
  }, [handleRegistration, setRegisterMessage, account])

  useEffect(() => {
    if (!pushClient) {
      return
    }

    const handlePushSubscription = async () => {
      await SendTestOnboardNotification()
      refreshPushState()
    }

    const handlePushClientEvent = async () => {
      refreshPushState()
    }

    const handleNotificationEvent = async () => {
      refreshPushState()
      setUnread((prev) => prev + 1)
    }
    emitter.on('push_signature_requested', ({ message }) => {
      setRegisterMessage(message)
    })

    emitter.on('push_signature_request_cancelled', () => setRegisterMessage(null))

    pushClient.on('push_subscription', handlePushSubscription)
    pushClient.on('push_response', handlePushSubscription)
    pushClient.on('push_delete', handlePushClientEvent)
    pushClient.on('push_update', handlePushClientEvent)
    pushClient.on('push_message', handleNotificationEvent)
    pushClient.syncClient.on('sync_update', handlePushClientEvent)

    // eslint-disable-next-line consistent-return
    return () => {
      pushClient.off('push_subscription', handlePushSubscription)
      pushClient.off('push_response', handlePushSubscription)

      pushClient.off('push_delete', handlePushClientEvent)
      pushClient.off('push_update', handlePushClientEvent)
      pushClient.off('push_message', handleNotificationEvent)
      pushClient.syncClient.off('sync_update', handlePushClientEvent)
      emitter.off('push_signature_requested', ({ message }) => {
        setRegisterMessage(message)
      })

      emitter.off('push_signature_request_cancelled', () => setRegisterMessage(null))
    }
  }, [pushClient, refreshPushState, SendTestOnboardNotification, emitter])

  return (
    <PushClientContext.Provider
      value={{
        activeSubscriptions,
        registerMessage,
        pushClient,
        refreshPushState,
        account,
        getMessageHistory,
        subscribe,
        reject,
        update,
        deleteSubscription,
        deletePushMessage,
        setUnread,
        unread,
        postMessage,
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
