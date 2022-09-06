/* eslint-disable consistent-return */
import * as React from 'react'

import { GetAccountResult, getAccount, watchAccount } from '@pancakeswap/aptos/core'
import { useClient } from '../context'
import { useSyncExternalStoreWithTracked } from './useSyncExternalStoreWithTracked'

export type UseAccountConfig = {
  /** Function to invoke when connected */
  onConnect?({
    account,
    connector,
    isReconnected,
  }: {
    account?: GetAccountResult['account']
    connector?: GetAccountResult['connector']
    isReconnected: boolean
  }): void
  /** Function to invoke when disconnected */
  onDisconnect?(): void
}

export function useAccount({ onConnect, onDisconnect }: UseAccountConfig = {}) {
  const account = useSyncExternalStoreWithTracked(watchAccount, getAccount)

  const { subscribe } = useClient()

  React.useEffect(() => {
    // No need to subscribe if these callbacks aren't defined
    if (!onConnect && !onDisconnect) return

    // Trigger update when status changes
    const unsubscribe = subscribe(
      (state) => state.status,
      (status, prevStatus) => {
        if (!!onConnect && status === 'connected') {
          const { account: gotAccount, connector } = getAccount()
          onConnect({
            account: gotAccount,
            connector,
            isReconnected: prevStatus === 'reconnecting',
          })
        }

        if (!!onDisconnect && prevStatus !== 'connecting' && status === 'disconnected') onDisconnect()
      },
    )
    return unsubscribe
  }, [onConnect, onDisconnect, subscribe])

  return account
}
