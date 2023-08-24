import type ChatClient from '@walletconnect/chat-client'
import type { JsonRpcRequest } from '@walletconnect/jsonrpc-utils'

// Omitting chat client management keys
type NonFunctionChatClientKeys =
  | 'chatContacts'
  | 'chatKeys'
  | 'chatMessages'
  | 'chatReceivedInvites'
  | 'chatReceivedInvitesStatus'
  | 'chatSentInvites'
  | 'chatThreads'
  | 'chatThreadsPending'
  | 'core'
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
  | 'name'
  | 'off'
  | 'on'
  | 'once'
  | 'opts'
  | 'projectId'
  | 'removeListener'
  | 'syncClient'

/*
 * These methods are not currently async in the chat client
 * forcing their type (and implementing them as so) makes them
 * more seamless to implement with both internal & external providers
 */
interface ModifiedChatClientFunctions {
  getMessages: (
    ...params: Parameters<ChatClient['getMessages']>
  ) => Promise<ReturnType<ChatClient['getMessages']>>
  getSentInvites: (
    ...params: Parameters<ChatClient['getSentInvites']>
  ) => Promise<ReturnType<ChatClient['getSentInvites']>>
  getReceivedInvites: (
    ...params: Parameters<ChatClient['getReceivedInvites']>
  ) => Promise<ReturnType<ChatClient['getReceivedInvites']>>
  getThreads: (
    ...params: Parameters<ChatClient['getThreads']>
  ) => Promise<ReturnType<ChatClient['getThreads']>>
  getMutedContacts: () => Promise<string[]>
  muteContact: (params: { topic: string }) => Promise<void>
  unmuteContact: (params: { topic: string }) => Promise<void>
}

export type ChatClientFunctions = ModifiedChatClientFunctions &
  Omit<ChatClient, NonFunctionChatClientKeys>
export type W3iChat = ModifiedChatClientFunctions &
  Omit<ChatClientFunctions, keyof ModifiedChatClientFunctions>

export type W3iChatProvider = W3iChat & {
  isListeningToMethodFromPostMessage: (method: string) => boolean
  handleMessage: (request: JsonRpcRequest<unknown>) => void
}
