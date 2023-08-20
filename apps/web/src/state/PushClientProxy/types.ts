import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'
import type { WalletClient as PushWalletClient } from '@walletconnect/push-client'

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
 * These methods are not currently async in the PushWalletClient
 * forcing their type (and implementing them as so) makes them
 * more seamless to implement with both internal & external providers
 */
interface ModifiedPushClientFunctions {
  getActiveSubscriptions: (
    ...params: Parameters<PushWalletClient['getActiveSubscriptions']>
  ) => Promise<ReturnType<PushWalletClient['getActiveSubscriptions']>>
  getMessageHistory: (
    ...params: Parameters<PushWalletClient['getMessageHistory']>
  ) => Promise<ReturnType<PushWalletClient['getMessageHistory']>>
}

export type PushClientFunctions = Omit<PushWalletClient, NonMethodPushClientKeys>
export type Push = ModifiedPushClientFunctions & Omit<PushClientFunctions, keyof ModifiedPushClientFunctions>

export type PushProvider = Push & {
  isListeningToMethodFromPostMessage: (method: string) => boolean
  handleMessage: (request: JsonRpcRequest<unknown>) => void
}
