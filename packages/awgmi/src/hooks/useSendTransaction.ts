import * as React from 'react'
import { sendTransaction, SendTransactionArgs, SendTransactionResult } from '@pancakeswap/awgmi/core'

import { MutationConfig } from '../types'
import { useMutation } from './utils/useMutation'

export type UseSendTransactionArgs = Partial<SendTransactionArgs>

export type UseSendTransactionMutationArgs = Partial<SendTransactionArgs>
export type UseSendTransactionConfig = MutationConfig<SendTransactionResult, Error, SendTransactionArgs>

export const mutationKey = (args: any /** TODO: fix type UseSendTransactionArgs */) =>
  [{ entity: 'sendTransaction', ...args }] as const

const mutationFn = async ({ networkName, payload, options }: SendTransactionArgs) => {
  return sendTransaction({
    networkName,
    payload,
    options,
  } as SendTransactionArgs)
}

export function useSendTransaction({
  networkName,
  payload,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: UseSendTransactionArgs & UseSendTransactionConfig = {}) {
  const { data, error, isError, isIdle, isLoading, isSuccess, mutate, mutateAsync, reset, status, variables } =
    useMutation(
      mutationKey({
        networkName,
        payload,
      } as SendTransactionArgs),
      mutationFn,
      {
        onError,
        onMutate,
        onSettled,
        onSuccess,
      },
    )

  const _sendTransaction = React.useCallback(
    (args: UseSendTransactionMutationArgs) =>
      mutate({
        networkName,
        payload,
        ...args,
      } as SendTransactionArgs),
    [mutate, networkName, payload],
  )

  const _sendTransactionAsync = React.useCallback(
    (args?: UseSendTransactionMutationArgs) =>
      mutateAsync({
        networkName,
        payload,
        ...args,
      } as SendTransactionArgs),
    [mutateAsync, networkName, payload],
  )

  return {
    data,
    error,
    isError,
    isIdle,
    isLoading,
    isSuccess,
    reset,
    sendTransaction: _sendTransaction,
    sendTransactionAsync: _sendTransactionAsync,
    status,
    variables,
  }
}
