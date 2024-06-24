import { isUserTransaction } from '@pancakeswap/awgmi/core'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useQueries } from '@tanstack/react-query'
import { ToastDescriptionWithTx } from 'components/Toast'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { finalizeTransaction } from './actions'
import { useAllChainTransactions } from './hooks'
import { TransactionDetails, useTransactionState } from './reducer'

export function shouldCheck(tx: TransactionDetails): boolean {
  if (tx.receipt) return false
  return true
}

export default function Updater(): null {
  const { chainId, provider, networkName } = useActiveWeb3React()
  const { t } = useTranslation()

  const [, dispatch] = useTransactionState()
  const transactions = useAllChainTransactions()

  const { toastError, toastSuccess } = useToast()

  useQueries({
    queries: useMemo(
      () =>
        Object.keys(transactions)
          .filter((hash) => shouldCheck(transactions[hash]))
          .map((hash) => {
            return {
              enabled: Boolean(chainId && provider),
              queryFn: async () => {
                const receipt = await provider.waitForTransaction({ transactionHash: hash })
                if (receipt && isUserTransaction(receipt)) {
                  dispatch(
                    finalizeTransaction({
                      chainId,
                      hash,
                      receipt: {
                        blockNumber: receipt.version,
                        sequenceNumber: receipt.sequence_number,
                        from: receipt.sender,
                        success: receipt.success,
                        transactionHash: receipt.hash,
                        payload: receipt.payload,
                        timestamp: receipt.timestamp,
                      },
                    }),
                  )

                  const toast = receipt.success ? toastSuccess : toastError
                  toast(t('Transaction receipt'), <ToastDescriptionWithTx txHash={receipt.hash} />)
                }
                return receipt
              },
              queryKey: [{ entity: 'transaction', hash, networkName }],
            }
          }),
      [chainId, dispatch, networkName, provider, t, toastError, toastSuccess, transactions],
    ),
  })

  return null
}
