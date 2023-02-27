import { TransactionResponse, UserRejectedRequestError } from '@pancakeswap/awgmi/core'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useCallback, useState } from 'react'
import { ToastDescriptionWithTx } from 'components/Toast'
import { transactionErrorToUserReadableMessage } from 'utils/transactionErrorToUserReadableMessage'

export type TxResponse = TransactionResponse | null

export type CatchTxErrorReturn = {
  fetchWithCatchTxError: (fn: () => Promise<TxResponse>) => Promise<TransactionReceipt | null>
  loading: boolean
}

interface TransactionReceipt {
  status: boolean
  transactionHash: string
}

// type ErrorData = {
//   code: number
//   message: string
// }

// type TxError = {
//   data: ErrorData
//   error: string
// }

// -32000 is insufficient funds for gas * price + value
// const isGasEstimationError = (err: TxError): boolean => err?.data?.code === -32000

export default function useCatchTxError(): CatchTxErrorReturn {
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const [loading, setLoading] = useState(false)

  // const handleNormalError = useCallback(
  //   (error, tx?: TxResponse) => {
  //     // logError(error)

  //     if (tx) {
  //       toastError(
  //         t('Error'),
  //         <ToastDescriptionWithTx txHash={tx.hash}>
  //           {t('Please try again. Confirm the transaction and make sure you are paying enough gas!')}
  //         </ToastDescriptionWithTx>,
  //       )
  //     } else {
  //       toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
  //     }
  //   },
  //   [t, toastError],
  // )

  const fetchWithCatchTxError = useCallback(
    async (_callTx: () => Promise<TxResponse>): Promise<TransactionReceipt | null> => {
      let tx: TxResponse = null

      try {
        setLoading(true)

        tx = await _callTx()

        if (tx?.hash) {
          toastSuccess(`${t('Transaction Submitted')}!`, <ToastDescriptionWithTx txHash={tx.hash} />)
        }

        const receipt = await tx?.wait()

        if (receipt) {
          return {
            // @ts-ignore
            status: receipt?.success,
            transactionHash: receipt.hash,
          }
        }
        return null
      } catch (error: any) {
        setLoading(false)

        if (!(error instanceof UserRejectedRequestError)) {
          const reason = transactionErrorToUserReadableMessage(error)
          const errorMessage = reason ? t('Transaction failed with error: %reason%', { reason }) : ''
          toastError(`${t('Failed')}!`, errorMessage)
        }
      } finally {
        setLoading(false)
      }

      return null
    },
    [t, toastSuccess, toastError],
  )

  return {
    fetchWithCatchTxError,
    loading,
  }
}
