/* eslint-disable consistent-return */
import * as React from 'react'

import { GetAccountResult, getAccount, watchAccount } from '@pancakeswap/awgmi/core'
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
  const previousAccount = React.useRef<typeof account>()

  if (!!onConnect && previousAccount.current?.status !== 'connected' && account.status === 'connected')
    onConnect({
      account: account.account,
      connector: account.connector,
      isReconnected: previousAccount.current?.status === 'reconnecting',
    })

  if (!!onDisconnect && previousAccount.current?.status === 'connected' && account.status === 'disconnected')
    onDisconnect()

  previousAccount.current = account

  return account
}
