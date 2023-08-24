import React from 'react'
import W3iContext from './context'
import { useUiState } from './hooks/uiHooks'
import { useProviderQueries } from './hooks/providerQueryHooks'
import { useAuthState } from './hooks/authHooks'
import { useChatState } from './hooks/chatHooks'
import { usePushState } from './hooks/pushHooks'
import { useW3iProxy } from './hooks/w3iProxyHooks'
import { useDappOrigin } from './hooks/dappOrigin'
import { useAccount } from 'wagmi'

interface W3iContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

const W3iContextProvider: React.FC<W3iContextProviderProps> = ({ children }) => {
  const { uiEnabled } = useUiState()
  const { dappOrigin, dappIcon, dappName, dappNotificationDescription } = useDappOrigin()
  const { chatProvider, pushProvider, authProvider } = useProviderQueries()
  const [w3iProxy, isW3iProxyReady] = useW3iProxy()

  const { setUserPubkey, disconnect } = useAuthState(w3iProxy, isW3iProxyReady)
  const { address: userPubkey } = useAccount()

  const {
    chatClient,
    sentInvites,
    refreshChatState,
    threads,
    invites,
    registeredKey: chatRegisteredKey,
    registerMessage: chatRegisterMessage
  } = useChatState(w3iProxy, isW3iProxyReady)

  const {
    pushClient,
    activeSubscriptions,
    refreshPushState,
    registerMessage: pushRegisterMessage,
    registeredKey: pushRegisteredKey
  } = usePushState(w3iProxy, isW3iProxyReady, dappOrigin)

  return (
    <W3iContext.Provider
      value={{
        chatClientProxy: chatClient,
        chatProvider,
        pushProvider,
        authProvider,
        userPubkey,
        uiEnabled,
        dappOrigin,
        dappName,
        dappNotificationDescription,
        dappIcon,
        refreshThreadsAndInvites: refreshChatState,
        refreshNotifications: refreshPushState,
        sentInvites,
        threads,
        activeSubscriptions,
        invites,
        disconnect,
        chatRegisteredKey,
        pushRegisteredKey,
        setUserPubkey,
        chatRegisterMessage,
        pushRegisterMessage,
        pushClientProxy: pushClient
      }}
    >
      {children}
    </W3iContext.Provider>
  )
}

export default W3iContextProvider
