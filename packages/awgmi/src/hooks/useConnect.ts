import { ConnectArgs, ConnectResult, connect as connectCore } from '@pancakeswap/awgmi/core'
import { useMutation } from '@tanstack/react-query'
import * as React from 'react'
import { useClient } from '../context'
import { MutationConfig } from '../types'

export type UseConnectArgs = Partial<ConnectArgs>

export type UseConnectConfig = MutationConfig<ConnectResult, Error, ConnectArgs>

export const mutationKey = (args: UseConnectArgs) => [{ entity: 'connect', ...args }] as const

const mutationFn = (args: UseConnectArgs) => {
  const { connector, networkName } = args
  if (!connector) throw new Error('connector is required')
  return connectCore({ connector, networkName })
}

export function useConnect({
  connector,
  networkName,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseConnectArgs & UseConnectConfig = {}) {
  const client = useClient()

  const { data, error, isError, isIdle, isPending, isSuccess, mutate, mutateAsync, reset, status, variables } =
    useMutation({
      mutationKey: mutationKey({ connector, networkName }),
      mutationFn,
      onError,
      onMutate,
      onSettled,
      onSuccess,
    })

  const connect = React.useCallback(
    (args?: Partial<ConnectArgs>) => {
      return mutate(<ConnectArgs>{
        connector: args?.connector ?? connector,
        networkName: args?.networkName ?? networkName,
      })
    },
    [connector, mutate, networkName],
  )

  const connectAsync = React.useCallback(
    (args?: Partial<ConnectArgs>) => {
      return mutateAsync(<ConnectArgs>{
        connector: args?.connector ?? connector,
        networkName: args?.networkName ?? networkName,
      })
    },
    [connector, mutateAsync, networkName],
  )

  return {
    connect,
    connectAsync,
    connectors: client.connectors,
    data,
    error,
    isError,
    isIdle,
    isPending,
    isSuccess,
    pendingConnector: variables?.connector,
    reset,
    status,
    variables,
  } as const
}
