import { useMutation } from '@tanstack/react-query'

import * as React from 'react'
import { sendTransaction, SendTransactionArgs, SendTransactionResult } from '../../core/transaction'

import { MutationConfig } from '../types'

export type UseSendTransactionArgs = SendTransactionArgs

export type UseSendTransactionMutationArgs = any
export type UseSendTransactionConfig = MutationConfig<SendTransactionResult, Error, SendTransactionArgs>

type SendTransactionFn = (overrideConfig?: UseSendTransactionMutationArgs) => void
type SendTransactionAsyncFn = (overrideConfig?: UseSendTransactionMutationArgs) => Promise<SendTransactionResult>
type MutateFnReturnValue<Args, Fn> = Args extends {
  mode: 'recklesslyUnprepared'
}
  ? Fn
  : Fn | undefined

export const mutationKey = (args: UseSendTransactionArgs) => [{ entity: 'sendTransaction', ...args }] as const

const mutationFn = async ({ networkName, payload }: SendTransactionArgs) => {
  return sendTransaction({
    networkName,
    payload,
  } as SendTransactionArgs)
}

export function useSendTransaction<Args extends UseSendTransactionArgs = UseSendTransactionArgs>({
  networkName,
  payload,
  onError,
  onMutate,
  onSettled,
  onSuccess,
}: Args & UseSendTransactionConfig) {
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
    (_args?: UseSendTransactionMutationArgs) =>
      mutate({
        networkName,
        payload,
      } as SendTransactionArgs),
    [mutate, networkName, payload],
  )

  const _sendTransactionAsync = React.useCallback(
    (_args?: UseSendTransactionMutationArgs) =>
      mutateAsync({
        networkName,
        payload,
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
    sendTransaction: _sendTransaction as MutateFnReturnValue<Args, SendTransactionFn>,
    sendTransactionAsync: _sendTransactionAsync as MutateFnReturnValue<Args, SendTransactionAsyncFn>,
    status,
    variables,
  }
}
