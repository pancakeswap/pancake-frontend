import React, { useCallback, useState } from 'react'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import ethers from 'ethers'
import { ToastDescriptionWithTx } from 'components/Toast'

import useToast from 'hooks/useToast'
import { logError, isUserRejected } from 'utils/sentry'

export type TxReponse = ethers.providers.TransactionResponse | null

export type CatchTxErrorReturn = {
  fetchWithCatchTxError: (fn: () => Promise<TxReponse>) => Promise<ethers.providers.TransactionReceipt>
  loading: boolean
}

type ErrorData = {
  code: number
  message: string
}

type TxError = {
  data: ErrorData
}

// -32000 is insufficient funds for gas * price + value
const isGasEstimationError = (err: TxError): boolean => err?.data?.code === -32000

export default function useCatchTxError(): CatchTxErrorReturn {
  const { library } = useWeb3React()
  const { t } = useTranslation()
  const { toastError, toastSuccess } = useToast()
  const [loading, setLoading] = useState(false)

  const handleNormalError = useCallback(
    (error) => {
      logError(error)

      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    },
    [t, toastError],
  )

  const fetchWithCatchTxError = useCallback(
    async (callTx: () => Promise<TxReponse>): Promise<ethers.providers.TransactionReceipt | null> => {
      let tx: TxReponse = null

      try {
        setLoading(true)

        /**
         * https://github.com/vercel/swr/pull/1450
         *
         * wait for useSWRMutation finished, so we could apply SWR in case manually trigger tx call
         */
        tx = await callTx()

        toastSuccess(`${t('Transaction Submitted')}!`, <ToastDescriptionWithTx txHash={tx.hash} />)

        const receipt = await tx.wait()

        return receipt
      } catch (error: any) {
        if (!isUserRejected(error)) {
          if (!tx) {
            handleNormalError(error)
          } else {
            library
              .call(tx, tx.blockNumber)
              .then(() => {
                handleNormalError(error)
              })
              .catch((err: TxError) => {
                if (isGasEstimationError(err)) {
                  handleNormalError(error)
                } else {
                  logError(err)

                  toastError(
                    'Failed',
                    <ToastDescriptionWithTx txHash={tx.hash}>
                      {err?.data?.message
                        ? `Transaction failed with error: ${err?.data?.message}`
                        : 'Transaction failed. For detail error message:'}
                    </ToastDescriptionWithTx>,
                  )
                }
              })
          }
        }
      } finally {
        setLoading(false)
      }

      return null
    },
    [handleNormalError, toastError, library, toastSuccess, t],
  )

  return {
    fetchWithCatchTxError,
    loading,
  }
}
