import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallback, useState } from 'react'

import { SendTransactionResult, waitForTransaction, WaitForTransactionResult } from '@wagmi/core'
import { isUserRejected, logError } from 'utils/sentry'
import { Hash } from 'viem'

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
const isGasEstimationError = (err: TxError): boolean => err?.data?.code === -32000

export default function useCatchTxError(): CatchTxErrorReturn {
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const [loading, setLoading] = useState(false)
  const [txResponseLoading, setTxResponseLoading] = useState(false)

  const handleNormalError = useCallback(
    (error) => {
      logError(error)

      // if (tx) {
      //   toastError(
      //     t('Error'),
      //     <ToastDescriptionWithTx txHash={tx.hash}>
      //       {t('Please try again. Confirm the transaction and make sure you are paying enough gas!')}
      //     </ToastDescriptionWithTx>,
      //   )
      // } else {
      // }
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
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
            toastError(
              t('Failed'),
              <ToastDescriptionWithTx txHash={typeof tx === 'string' ? tx : tx.hash}>
                {t('Transaction failed with error: %reason%', { reason: error.message })}
              </ToastDescriptionWithTx>,
            )
            // provider
            //   .call(tx, tx.blockNumber)
            //   .then(() => {
            //     handleNormalError(error, tx)
            //   })
            //   .catch((err: any) => {
            //     if (isGasEstimationError(err)) {
            //       handleNormalError(error, tx)
            //     } else {
            //       logError(err)

            //       let recursiveErr = err

            //       let reason: string | undefined

            //       // for MetaMask
            //       if (recursiveErr?.data?.message) {
            //         reason = recursiveErr?.data?.message
            //       } else {
            //         // for other wallets
            //         // Reference
            //         // https://github.com/Uniswap/interface/blob/ac962fb00d457bc2c4f59432d7d6d7741443dfea/src/hooks/useSwapCallback.tsx#L216-L222
            //         while (recursiveErr) {
            //           reason = recursiveErr.reason ?? recursiveErr.message ?? reason
            //           recursiveErr = recursiveErr.error ?? recursiveErr.data?.originalError
            //         }
            //       }

            //       const REVERT_STR = 'execution reverted: '
            //       const indexInfo = reason?.indexOf(REVERT_STR)
            //       const isRevertedError = indexInfo >= 0

            //       if (isRevertedError) reason = reason.substring(indexInfo + REVERT_STR.length)

            //       toastError(
            //         t('Failed'),
            //         <ToastDescriptionWithTx txHash={tx.hash}>
            //           {isRevertedError
            //             ? t('Transaction failed with error: %reason%', { reason })
            //             : t('Transaction failed. For detailed error message:')}
            //         </ToastDescriptionWithTx>,
            //       )
            //     }
            //   })
          }
        }
      } finally {
        setLoading(false)
      }

      return null
    },
    [handleNormalError, toastError, toastSuccess, t],
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

        toastSuccess(`${t('Transaction Submitted')}!`, <ToastDescriptionWithTx txHash={tx?.hash} />)

        return typeof tx === 'string'
          ? {
              hash: tx,
            }
          : tx
      } catch (error: any) {
        if (!isUserRejected(error)) {
          if (!tx) {
            handleNormalError(error)
          } else {
            toastError(
              t('Failed'),
              <ToastDescriptionWithTx txHash={typeof tx === 'string' ? tx : tx.hash}>
                {t('Transaction failed with error: %reason%', { reason: error.message })}
              </ToastDescriptionWithTx>,
            )
            // provider
            //   .call(tx, tx.blockNumber)
            //   .then(() => {
            //     handleNormalError(error, tx)
            //   })
            //   .catch((err: any) => {
            //     if (isGasEstimationError(err)) {
            //       handleNormalError(error, tx)
            //     } else {
            //       logError(err)
            //       let recursiveErr = err
            //       let reason: string | undefined
            //       // for MetaMask
            //       if (recursiveErr?.data?.message) {
            //         reason = recursiveErr?.data?.message
            //       } else {
            //         // for other wallets
            //         // Reference
            //         // https://github.com/Uniswap/interface/blob/ac962fb00d457bc2c4f59432d7d6d7741443dfea/src/hooks/useSwapCallback.tsx#L216-L222
            //         while (recursiveErr) {
            //           reason = recursiveErr.reason ?? recursiveErr.message ?? reason
            //           recursiveErr = recursiveErr.error ?? recursiveErr.data?.originalError
            //         }
            //       }
            //       const REVERT_STR = 'execution reverted: '
            //       const indexInfo = reason?.indexOf(REVERT_STR)
            //       const isRevertedError = indexInfo >= 0
            //       if (isRevertedError) reason = reason.substring(indexInfo + REVERT_STR.length)
            //       toastError(
            //         t('Failed'),
            //         <ToastDescriptionWithTx txHash={tx.hash}>
            //           {isRevertedError
            //             ? t('Transaction failed with error: %reason%', { reason })
            //             : t('Transaction failed. For detailed error message:')}
            //         </ToastDescriptionWithTx>,
            //       )
            //     }
            //   })
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
