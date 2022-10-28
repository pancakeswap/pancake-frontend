import { TransactionResponse } from '@pancakeswap/awgmi/core'
// import { useTranslation } from '@pancakeswap/localization'
// import { useToast } from '@pancakeswap/uikit'
import { useCallback, useState } from 'react'
// import { ToastDescriptionWithTx } from 'components/Toast'
import { TransactionReceipt } from 'state/transactions/actions'

// import useActiveWeb3React from './useActiveWeb3React'

export type TxResponse = TransactionResponse | null

export type CatchTxErrorReturn = {
  fetchWithCatchTxError: (fn: () => Promise<TxResponse>) => Promise<TransactionReceipt | null>
  loading: boolean
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
// const isGasEstimationError = (err: TxError): boolean => err?.data?.code === -32000

export default function useCatchTxError(): CatchTxErrorReturn {
  // const { provider } = useActiveWeb3React()
  // const { t } = useTranslation()
  // const { toastError, toastSuccess } = useToast()
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
      // let tx: TxResponse = null

      try {
        // TODO: Aptos
        const receipt = {} as TransactionReceipt
        return receipt
      } catch (error: any) {
        setLoading(false) // TODO: Aptos. Temporary to fix lint error.
      } finally {
        setLoading(false)
      }

      return null
    },
    [],
    // [handleNormalError, toastError, provider, toastSuccess, t],
  )

  return {
    fetchWithCatchTxError,
    loading,
  }
}
