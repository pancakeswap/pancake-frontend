import type { ChatClientTypes } from '@walletconnect/chat-client'
import { useCallback, useEffect, useState } from 'react'
import { noop } from 'rxjs'
import type { W3iChatClient } from '../../../w3iProxy'
import type Web3InboxProxy from '../../../w3iProxy'
import { useAuthState } from './authHooks'
import { useUiState } from './uiHooks'
import { useAccount } from 'wagmi'

export const useChatState = (w3iProxy: Web3InboxProxy, proxyReady: boolean) => {
  const [chatClient, setChatClient] = useState<W3iChatClient | null>(null)
  const [invites, setInvites] = useState<ChatClientTypes.ReceivedInvite[]>([])
  const [threads, setThreads] = useState<ChatClientTypes.Thread[]>([])
  const [sentInvites, setSentInvites] = useState<ChatClientTypes.SentInvite[]>([])

  const [registerMessage, setRegisterMessage] = useState<string | null>(null)
  const [registeredKey, setRegistered] = useState<string | null>(null)

  const { address: userPubkey } = useAccount()
  const { uiEnabled } = useUiState()

  useEffect(() => {
    if (proxyReady) {
      setChatClient(w3iProxy.chat)
    }
  }, [setChatClient, proxyReady])

  const refreshChatState = useCallback(() => {
    if (!chatClient || !userPubkey || !registeredKey) {
      return
    }

    chatClient
      .getReceivedInvites({ account: `eip155:1:${userPubkey}` })
      .then(invite => setInvites(Array.from(invite.values())))
    chatClient
      .getSentInvites({ account: `eip155:1:${userPubkey}` })
      .then(invite => setSentInvites(Array.from(invite.values())))
    chatClient
      .getThreads({ account: `eip155:1:${userPubkey}` })
      .then(invite => setThreads(Array.from(invite.values())))
  }, [chatClient, userPubkey, setThreads, registeredKey, setInvites])

  useEffect(() => {
    refreshChatState()
  }, [refreshChatState])

  const handleRegistration = useCallback(
    async (key: string) => {
      if (chatClient && key && uiEnabled.chat) {
        try {
          const registeredKeyRes = await chatClient.register({ account: `eip155:1:${key}` })
          refreshChatState()
          setRegistered(registeredKeyRes)
        } catch (error) {
          setRegisterMessage(null)
        }
      }
    },
    [uiEnabled, chatClient, refreshChatState, setRegisterMessage]
  )

  useEffect(() => {
    if (userPubkey) {
      handleRegistration(userPubkey).then(() => setRegisterMessage(null))
    } else {
      setRegistered(null)
      setRegisterMessage(null)
    }
  }, [chatClient, userPubkey, setRegisterMessage, setRegistered])

  useEffect(() => {
    if (!chatClient) {
      return noop
    }

    const inviteSub = chatClient.observe('chat_invite', {
      next: () => {
        refreshChatState()
      }
    })

    const signatureSub = chatClient.observe('chat_signature_requested', {
      next: ({ message }) => {
        setRegisterMessage(message)
      }
    })

    const inviteSentSub = chatClient.observe('chat_invite_sent', { next: refreshChatState })
    const syncSub = chatClient.observe('sync_update', {
      next: () => {
        refreshChatState()
      }
    })
    const pingSub = chatClient.observe('chat_ping', {
      next: () => {
        refreshChatState()
      }
    })
    const chatMessageSentSub = chatClient.observe('chat_message_sent', { next: refreshChatState })
    const chatJoinedSub = chatClient.observe('chat_joined', { next: refreshChatState })
    const inviteAcceptedSub = chatClient.observe('chat_invite_accepted', { next: refreshChatState })
    const inviteRejectedSub = chatClient.observe('chat_invite_rejected', { next: refreshChatState })

    return () => {
      inviteSub.unsubscribe()
      pingSub.unsubscribe()
      syncSub.unsubscribe()
      signatureSub.unsubscribe()
      inviteSentSub.unsubscribe()
      inviteAcceptedSub.unsubscribe()
      inviteRejectedSub.unsubscribe()
      chatMessageSentSub.unsubscribe()
      chatJoinedSub.unsubscribe()
    }
  }, [chatClient, refreshChatState])

  return {
    chatClient,
    refreshChatState,
    registeredKey,
    invites,
    threads,
    sentInvites,
    registerMessage
  }
}
