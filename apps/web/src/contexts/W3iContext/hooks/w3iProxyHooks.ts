'use client'

import { useEffect, useState } from 'react'
import Web3InboxProxy from '../../../w3iProxy'
import { useDappOrigin } from './dappOrigin'
import { useProviderQueries } from './providerQueryHooks'
import { useUiState } from './uiHooks'
import { DEFAULT_PROJECT_ID } from 'views/Notifications/constants'

export const useW3iProxy = () => {
  const relayUrl = 'wss://relay.walletconnect.com'
  const projectId = DEFAULT_PROJECT_ID

  const { uiEnabled } = useUiState()
  const [ready, setReady] = useState(false)
  const { dappOrigin } = useDappOrigin()
  const { chatProvider, pushProvider, authProvider } = useProviderQueries()

  const [w3iProxy] = useState(
    Web3InboxProxy.getProxy(
      chatProvider,
      pushProvider,
      authProvider,
      dappOrigin,
      projectId,
      relayUrl,
      uiEnabled
    )
  )

  useEffect(() => {
    w3iProxy.init().then(() => setReady(true))
  }, [w3iProxy, setReady])

  return [w3iProxy, ready] as [Web3InboxProxy, boolean]
}
