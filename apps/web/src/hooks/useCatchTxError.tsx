import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallback, useState } from 'react'
import { WaitForTransactionResult, SendTransactionResult } from 'wagmi/actions'
import { isUserRejected, logError } from 'utils/sentry'
import { Hash } from 'viem'
import { usePublicNodeWaitForTransaction } from './usePublicNodeWaitForTransaction'

export type CatchTxErrorReturn = {
  fetchWithCatchTxError: (fn: () => Promise<SendTransactionResult | Hash>) => Promise<WaitForTransactionResult>
  fetchTxResponse: (fn: () => Promise<SendTransactionResult | Hash>) => Promise<SendTransactionResult>
  loading: boolean
  txResponseLoading: boolean
}

type ErrorData = {
  code: number
  message: string
}

type TxError = {
  data: ErrorData
  error: string
}

// -32000 is insufficient funds for gas * price + value
const _isGasEstimationError = (err: TxError): boolean => err?.data?.code === -32000

function parseError(err) {
  if (typeof err === 'object') {
    if ('shortMessage' in err) {
      return err
    }
    return parseError(err?.cause)
  }
  return null
}

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
      const notPreview = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview'
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
            const notPreview = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview'
            const err = parseError(error)
            toastError(
              t('Failed'),
              <ToastDescriptionWithTx txHash={typeof tx === 'string' ? tx : tx.hash}>
                {err
                  ? t('Transaction failed with error: %reason%', {
                      reason: notPreview ? err.shortMessage || err.message : err.message,
                    })
                  : t('Transaction failed. For detailed error message:')}
              </ToastDescriptionWithTx>,
            )
          }
        }
      } finally {
        setLoading(false)
      }

      return null
    },
    [toastSuccess, t, waitForTransaction, handleNormalError, toastError],
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
        const notPreview = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview'
        if (!isUserRejected(error)) {
          if (!tx) {
            handleNormalError(error)
          } else {
            const err = parseError(error)
            toastError(
              t('Failed'),
              <ToastDescriptionWithTx txHash={typeof tx === 'string' ? tx : tx.hash}>
                {err
                  ? t('Transaction failed with error: %reason%', {
                      reason: notPreview ? err.shortMessage || err.message : err.message,
                    })
                  : t('Transaction failed. For detailed error message:')}
              </ToastDescriptionWithTx>,
            )
          }
        }
      } finally {
        setTxResponseLoading(false)
      }

      return null
    },
    [handleNormalError, toastError, toastSuccess, t],
  )

  return {
    fetchWithCatchTxError,
    fetchTxResponse,
    loading,
    txResponseLoading,
  }
}
