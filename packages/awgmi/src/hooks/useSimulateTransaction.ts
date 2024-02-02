import { simulateTransaction, SimulateTransactionArgs, SimulateTransactionResult } from '@pancakeswap/awgmi/core'
import { useMutation } from '@tanstack/react-query'
import * as React from 'react'
import { MutationConfig } from '../types'
import { useNetwork } from './useNetwork'

export type UseSimulateTransactionArgs = Partial<SimulateTransactionArgs>

export type UseSimulateTransactionMutationArgs = Partial<SimulateTransactionArgs>
export type UseSimulateTransactionConfig = MutationConfig<SimulateTransactionResult, Error, SimulateTransactionArgs>

export const mutationKey = (
  args: any,
  // UseSimulateTransactionArgs
  // error TS4023: Exported variable 'mutationKey' has or is using name 'MoveFunctionVisibility' from external module
) => [{ entity: 'simulateTransaction', ...args }] as const

const mutationFn = async ({ networkName, payload, options, throwOnError, query }: SimulateTransactionArgs) => {
  return simulateTransaction({
    networkName,
    payload,
    options,
    throwOnError,
    query,
  } as SimulateTransactionArgs)
}

export function useSimulateTransaction({
  networkName: networkName_,
  payload,
  options,
  query,
  throwOnError,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseSimulateTransactionArgs & UseSimulateTransactionConfig = {}) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  const { data, error, isError, isIdle, isPending, isSuccess, mutate, mutateAsync, reset, status, variables } =
    useMutation({
      mutationKey: mutationKey({ networkName, payload, options, query, throwOnError }),
      mutationFn,
      onError,
      onMutate,
      onSettled,
      onSuccess,
    })

  const _simulateTransaction = React.useCallback(
    (args: UseSimulateTransactionMutationArgs) =>
      mutate({
        networkName,
        payload,
        options,
        query,
        throwOnError,
        ...args,
      } as SimulateTransactionArgs),
    [mutate, networkName, options, payload, query, throwOnError],
  )

  const _simulateTransactionAsync = React.useCallback(
    (args?: UseSimulateTransactionMutationArgs) =>
      mutateAsync({
        networkName,
        payload,
        options,
        query,
        throwOnError,
        ...args,
      } as SimulateTransactionArgs),
    [mutateAsync, networkName, options, payload, query, throwOnError],
  )

  return {
    data,
    error,
    isError,
    isIdle,
    isPending,
    isSuccess,
    reset,
    simulateTransaction: _simulateTransaction,
    simulateTransactionAsync: _simulateTransactionAsync,
    status,
    variables,
  }
}
