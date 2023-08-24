import type { NotifyClientTypes } from '@walletconnect/notify-client'
import type { ChatClientTypes } from '@walletconnect/chat-client'

export interface ChatFacadeEvents {
  chat_invite: ChatClientTypes.BaseEventArgs<ChatClientTypes.Invite>
  chat_message: ChatClientTypes.BaseEventArgs<ChatClientTypes.Message>
  chat_joined: ChatClientTypes.BaseEventArgs
  chat_ping: ChatClientTypes.BaseEventArgs
  chat_left: ChatClientTypes.BaseEventArgs
  chat_invite_accepted: {
    invite: ChatClientTypes.SentInvite
    topic: string
  }
  chat_invite_rejected: { invite: ChatClientTypes.SentInvite }
  chat_invite_sent: never
  chat_message_sent: never
  chat_message_attempt: never
  chat_signature_requested: { message: string }
  chat_account_change: { account: string }
  sync_update: never
}

export interface PushFacadeEvents {
  notify_message: NotifyClientTypes.EventArguments['notify_message']
  notify_subscription: NotifyClientTypes.EventArguments['notify_subscription']
  notify_update: NotifyClientTypes.EventArguments['notify_update']
  notify_delete: NotifyClientTypes.EventArguments['notify_delete']
  notify_signature_requested: { message: string }
  notify_signature_request_cancelled: never
  sync_update: never
}
