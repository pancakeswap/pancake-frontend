import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { NotifyClient } from '@walletconnect/notify-client'

// Omitting non-method PushWalletClient keys
type NonMethodPushClientKeys =
  | 'context'
  | 'core'
  | 'decryptMessage'
  | 'emit'
  | 'engine'
  | 'events'
  | 'history'
  | 'historyClient'
  | 'identityKeys'
  | 'init'
  | 'initSyncStores'
  | 'keyserverUrl'
  | 'logger'
  | 'messages'
  | 'name'
  | 'off'
  | 'on'
  | 'once'
  | 'opts'
  | 'pairing'
  | 'proposals'
  | 'protocol'
  | 'removeListener'
  | 'requests'
  | 'subscriptions'
  | 'syncClient'
  | 'SyncStoreController'
  | 'version'

/*
 * These methods are not currently async in the NotifyClient
 * forcing their type (and implementing them as so) makes them
 * more seamless to implement with both internal & external providers
 */
interface ModifiedPushClientFunctions {
  getActiveSubscriptions: (
    ...params: Parameters<NotifyClient['getActiveSubscriptions']>
  ) => Promise<ReturnType<NotifyClient['getActiveSubscriptions']>>
  getMessageHistory: (
    ...params: Parameters<NotifyClient['getMessageHistory']>
  ) => Promise<ReturnType<NotifyClient['getMessageHistory']>>
}

export type PushClientFunctions = Omit<NotifyClient, NonMethodPushClientKeys>
export type W3iPush = ModifiedPushClientFunctions &
  Omit<PushClientFunctions, keyof ModifiedPushClientFunctions>

export type W3iPushProvider = W3iPush & {
  isListeningToMethodFromPostMessage: (method: string) => boolean
  handleMessage: (request: JsonRpcRequest<unknown>) => void
}
