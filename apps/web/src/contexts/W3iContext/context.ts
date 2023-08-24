import type { ChatClientTypes } from '@walletconnect/chat-client'
import type { NotifyClientTypes } from '@walletconnect/notify-client'
import type { Dispatch, SetStateAction } from 'react'
// eslint-disable-next-line no-duplicate-imports
import { createContext } from 'react'
import type { W3iChatClient, W3iPushClient } from '../../w3iProxy'

export interface UiEnabled {
  chat: boolean
  notify: boolean
  settings: boolean
  sidebar: boolean
}

interface W3iContextState {
  chatClientProxy: W3iChatClient | null
  refreshThreadsAndInvites: () => void
  refreshNotifications: () => void
  setUserPubkey: Dispatch<SetStateAction<string | undefined>>
  activeSubscriptions: NotifyClientTypes.NotifySubscription[]
  sentInvites: ChatClientTypes.SentInvite[]
  threads: ChatClientTypes.Thread[]
  invites: ChatClientTypes.ReceivedInvite[]
  userPubkey?: string
  disconnect: () => void
  pushClientProxy: W3iPushClient | null
  chatRegisterMessage: string | null
  chatRegisteredKey: string | null
  pushRegisteredKey: string | null
  pushRegisterMessage: string | null
  chatProvider: string
  pushProvider: string
  authProvider: string
  uiEnabled: UiEnabled
  dappOrigin: string
  dappName: string
  dappIcon: string
  dappNotificationDescription: string
}

const W3iContext = createContext<W3iContextState>({
  chatClientProxy: null,
  chatRegisteredKey: '',
  pushRegisteredKey: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshThreadsAndInvites: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  refreshNotifications: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  disconnect: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUserPubkey: () => {},
  threads: [],
  uiEnabled: { chat: true, notify: true, settings: true, sidebar: true },
  activeSubscriptions: [],
  sentInvites: [],
  invites: [],
  pushClientProxy: null,
  chatRegisterMessage: null,
  pushRegisterMessage: null,
  chatProvider: '',
  pushProvider: '',
  authProvider: '',
  dappOrigin: '',
  dappIcon: '',
  dappNotificationDescription: '',
  dappName: ''
})

export default W3iContext
