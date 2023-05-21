import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallback, useState } from 'react'
import { WaitForTransactionResult, SendTransactionResult } from 'wagmi/actions'
import { isUserRejected, logError } from 'utils/sentry'
import { BaseError, Hash, UnknownRpcError } from 'viem'
import { usePublicNodeWaitForTransaction } from './usePublicNodeWaitForTransaction'

export type CatchTxErrorReturn = {
  fetchWithCatchTxError: (fn: () => Promise<SendTransactionResult | Hash>) => Promise<WaitForTransactionResult>
  fetchTxResponse: (fn: () => Promise<SendTransactionResult | Hash>) => Promise<SendTransactionResult>
  loading: boolean
  txResponseLoading: boolean
}

/// only show corrected parsed viem error
export function parseError<TError>(err: TError): BaseError | null {
  if (err instanceof BaseError) {
    return err
  }
  if (typeof err === 'string') {
    return new UnknownRpcError(new Error(err))
  }
  if (err instanceof Error) {
    return new UnknownRpcError(err)
  }
  return null
}

const notPreview = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview'

export default function useCatchTxError(): CatchTxErrorReturn {
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const [loading, setLoading] = useState(false)
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const [txResponseLoading, setTxResponseLoading] = useState(false)

  const handleNormalError = useCallback(
    (error) => {
      logError(error)
      const err = parseError(error)
      if (err) {
        toastError(
          t('Error'),
          t('Transaction failed with error: %reason%', {
            reason: notPreview ? error.shortMessage || error.message : error.message,
          }),
        )
      } else {
        toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
      }
    },
    [t, toastError],
  )

  const handleTxError = useCallback(
    (error, hash) => {
      logError(error)
      const err = parseError(error)
      toastError(
        t('Failed'),
        <ToastDescriptionWithTx txHash={hash}>
          {err
            ? t('Transaction failed with error: %reason%', {
                reason: notPreview ? err.shortMessage || err.message : err.message,
              })
            : t('Transaction failed. For detailed error message:')}
        </ToastDescriptionWithTx>,
      )
    },
    [t, toastError],
  )

  const fetchWithCatchTxError = useCallback(
    async (callTx: () => Promise<SendTransactionResult | Hash>): Promise<WaitForTransactionResult | null> => {
      let tx: SendTransactionResult | Hash = null

      try {
        setLoading(true)

        /**
         * https://github.com/vercel/swr/pull/1450
         *
         * wait for useSWRMutation finished, so we could apply SWR in case manually trigger tx call
         */
        tx = await callTx()

        const hash = typeof tx === 'string' ? tx : tx.hash

        toastSuccess(`${t('Transaction Submitted')}!`, <ToastDescriptionWithTx txHash={hash} />)

        const receipt = await waitForTransaction({
          hash,
        })
        return receipt
      } catch (error: any) {
        if (!isUserRejected(error)) {
          if (!tx) {
            handleNormalError(error)
          } else {
            handleTxError(error, typeof tx === 'string' ? tx : tx.hash)
          }
        }
      } finally {
        setLoading(false)
      }

      return null
    },
    [toastSuccess, t, waitForTransaction, handleNormalError, handleTxError],
  )

  const fetchTxResponse = useCallback(
    async (callTx: () => Promise<SendTransactionResult | Hash>): Promise<SendTransactionResult> => {
      let tx: SendTransactionResult | Hash = null

      try {
        setTxResponseLoading(true)

        /**
         * https://github.com/vercel/swr/pull/1450
         *
         * wait for useSWRMutation finished, so we could apply SWR in case manually trigger tx call
         */
        tx = await callTx()

        const hash = typeof tx === 'string' ? tx : tx.hash

        toastSuccess(`${t('Transaction Submitted')}!`, <ToastDescriptionWithTx txHash={hash} />)

        return { hash }
      } catch (error: any) {
        if (!isUserRejected(error)) {
          if (!tx) {
            handleNormalError(error)
          } else {
            handleTxError(error, typeof tx === 'string' ? tx : tx.hash)
          }
        }
      } finally {
        setTxResponseLoading(false)
      }

      return null
    },
    [toastSuccess, t, handleNormalError, handleTxError],
  )

  return {
    fetchWithCatchTxError,
    fetchTxResponse,
    loading,
    txResponseLoading,
  }
}
