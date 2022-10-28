/* eslint-disable consistent-return */
/* eslint-disable default-case */
import shallow from 'zustand/shallow'
import { Connector, ConnectorData } from '../connectors/base'
import { getClient, Client } from '../client'

type Data = ConnectorData

export type GetAccountResult =
  | {
      account: NonNullable<Data['account']>
      connector: NonNullable<Client['connector']>
      isConnected: true
      isConnecting: false
      isDisconnected: false
      isReconnecting: false
      status: 'connected'
    }
  | {
      account: Data['account']
      connector: Client['connector']
      isConnected: boolean
      isConnecting: false
      isDisconnected: false
      isReconnecting: true
      status: 'reconnecting'
    }
  | {
      account: undefined
      connector: undefined
      isConnected: false
      isReconnecting: false
      isConnecting: true
      isDisconnected: false
      status: 'connecting'
    }
  | {
      account: undefined
      connector: undefined
      isConnected: false
      isReconnecting: false
      isConnecting: false
      isDisconnected: true
      status: 'disconnected'
    }

export function getAccount(): GetAccountResult {
  const { data, connector, status } = getClient()
  switch (status) {
    case 'connected':
      return {
        account: data?.account as NonNullable<Data['account']>,
        connector: connector as NonNullable<Client['connector']>,
        isConnected: true,
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: false,
        status,
      } as const
    case 'reconnecting':
      return {
        account: data?.account,
        connector,
        isConnected: !!data?.account,
        isConnecting: false,
        isDisconnected: false,
        isReconnecting: true,
        status,
      } as const
    case 'connecting':
      return {
        account: undefined,
        connector: undefined,
        isConnected: false,
        isConnecting: true,
        isDisconnected: false,
        isReconnecting: false,
        status,
      } as const
    case 'disconnected':
      return {
        account: undefined,
        connector: undefined,
        isConnected: false,
        isConnecting: false,
        isDisconnected: true,
        isReconnecting: false,
        status,
      } as const
  }
}

export type WatchAccountCallback = (data: GetAccountResult) => void

export type WatchAccountConfig = {
  selector?({
    account,
    connector,
    status,
  }: {
    account?: Data['account']
    connector?: Connector
    status: GetAccountResult['status']
  }): any
}

export function watchAccount(callback: WatchAccountCallback, { selector = (x) => x }: WatchAccountConfig = {}) {
  const client = getClient()
  const handleChange = () => callback(getAccount())
  const unsubscribe = client.subscribe(
    ({ data, connector, status }) =>
      selector({
        account: data?.account,
        connector,
        status,
      }),
    handleChange,
    {
      equalityFn: shallow,
    },
  )
  return unsubscribe
}
