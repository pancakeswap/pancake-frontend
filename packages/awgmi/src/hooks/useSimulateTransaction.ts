import * as React from 'react'
import { simulateTransaction, SimulateTransactionArgs, SimulateTransactionResult } from '@pancakeswap/awgmi/core'

import { MutationConfig } from '../types'
import { useMutation } from './utils/useMutation'
import { useNetwork } from './useNetwork'

export type UseSimulateTransactionArgs = Partial<SimulateTransactionArgs>

export type UseSimulateTransactionMutationArgs = Partial<SimulateTransactionArgs>
export type UseSimulateTransactionConfig = MutationConfig<SimulateTransactionResult, Error, SimulateTransactionArgs>

export const mutationKey = (
  args: any,
  // UseSimulateTransactionArgs
  // error TS4023: Exported variable 'mutationKey' has or is using name 'MoveFunctionVisibility' from external module
) => [{ entity: 'simulateTransaction', ...args }] as const

const mutationFn = async ({ networkName, payload, options, throwOnError }: SimulateTransactionArgs) => {
  return simulateTransaction({
    networkName,
    payload,
    options,
    throwOnError,
  } as SimulateTransactionArgs)
}

export function useSimulateTransaction({
  networkName: networkName_,
  payload,
  options,
  throwOnError,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseSimulateTransactionArgs & UseSimulateTransactionConfig = {}) {
  const { chain } = useNetwork()
  const networkName = networkName_ ?? chain?.network

  const { data, error, isError, isIdle, isLoading, isSuccess, mutate, mutateAsync, reset, status, variables } =
    useMutation(
      mutationKey({
        networkName,
        payload,
        options,
        throwOnError,
      } as SimulateTransactionArgs),
      mutationFn,
      {
        onError,
        onMutate,
        onSettled,
        onSuccess,
      },
    )

  const _simulateTransaction = React.useCallback(
    (args: UseSimulateTransactionMutationArgs) =>
      mutate({
        networkName,
        payload,
        options,
        throwOnError,
        ...args,
      } as SimulateTransactionArgs),
    [mutate, networkName, options, payload, throwOnError],
  )

  const _simulateTransactionAsync = React.useCallback(
    (args?: UseSimulateTransactionMutationArgs) =>
      mutateAsync({
        networkName,
        payload,
        options,
        throwOnError,
        ...args,
      } as SimulateTransactionArgs),
    [mutateAsync, networkName, options, payload, throwOnError],
  )

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    simulateTransaction: _simulateTransaction,
    simulateTransactionAsync: _simulateTransactionAsync,
    status,
    variables,
  }
}
