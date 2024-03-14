import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallback, useState } from 'react'
import { getViemErrorMessage, parseViemError } from 'utils/errors'
import { isUserRejected, logError } from 'utils/sentry'
import { Hash } from 'viem'
import { SendTransactionResult, WaitForTransactionResult } from 'wagmi/actions'
import { usePublicNodeWaitForTransaction } from './usePublicNodeWaitForTransaction'

export type CatchTxErrorReturn = {
  fetchWithCatchTxError: (
    fn: () => Promise<SendTransactionResult | Hash | undefined>,
  ) => Promise<WaitForTransactionResult | null>
  fetchTxResponse: (
    fn: () => Promise<SendTransactionResult | Hash | undefined>,
  ) => Promise<SendTransactionResult | null>
  loading: boolean
  txResponseLoading: boolean
}

const notPreview = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'preview'

type Params = {
  throwUserRejectError?: boolean
  throwCustomError?: () => void
}

export default function useCatchTxError(params?: Params): CatchTxErrorReturn {
  const { throwUserRejectError = false, throwCustomError } = params || {}
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const [loading, setLoading] = useState(false)
  const { waitForTransaction } = usePublicNodeWaitForTransaction()
  const [txResponseLoading, setTxResponseLoading] = useState(false)

  const handleNormalError = useCallback(
    (error) => {
      logError(error)
      const err = parseViemError(error)
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
      const err = parseViemError(error)
      toastError(
        t('Failed'),
        <ToastDescriptionWithTx txHash={hash}>
          {err
            ? t('Transaction failed with error: %reason%', {
                reason: notPreview ? getViemErrorMessage(err) : err.message,
              })
            : t('Transaction failed. For detailed error message:')}
        </ToastDescriptionWithTx>,
      )
    },
    [t, toastError],
  )

  const fetchWithCatchTxError = useCallback(
    async (
      callTx: () => Promise<SendTransactionResult | Hash | undefined>,
    ): Promise<WaitForTransactionResult | null> => {
      let tx: SendTransactionResult | Hash | null | undefined = null

      try {
        setLoading(true)

        tx = await callTx()
        if (!tx) {
          return null
        }
        const hash = typeof tx === 'string' ? tx : tx.hash
        toastSuccess(`${t('Transaction Submitted')}!`, <ToastDescriptionWithTx txHash={hash} />)

        const receipt = await waitForTransaction({
          hash,
        })
        if (receipt?.status === 'success') {
          return receipt
        }
        throw Error(t('Failed'))
      } catch (error: any) {
        if (!isUserRejected(error)) {
          if (!tx) {
            handleNormalError(error)
          } else if (throwCustomError) {
            throwCustomError()
          } else {
            handleTxError(error, typeof tx === 'string' ? tx : tx.hash)
          }
        }
        if (throwUserRejectError) {
          throw error
        }
      } finally {
        setLoading(false)
      }

      return null
    },
    [toastSuccess, t, waitForTransaction, throwUserRejectError, throwCustomError, handleNormalError, handleTxError],
  )

  const fetchTxResponse = useCallback(
    async (callTx: () => Promise<SendTransactionResult | Hash | undefined>): Promise<SendTransactionResult | null> => {
      let tx: SendTransactionResult | Hash | null | undefined = null

      try {
        setTxResponseLoading(true)

        /**
         * https://github.com/vercel/swr/pull/1450
         *
         * wait for useSWRMutation finished, so we could apply SWR in case manually trigger tx call
         */
        tx = await callTx()

        if (!tx) return null

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
