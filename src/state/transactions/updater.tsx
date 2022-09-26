import React, { useEffect, useRef } from 'react'
import merge from 'lodash/merge'
import pickBy from 'lodash/pickBy'
import forEach from 'lodash/forEach'
import { useTranslation } from '@pancakeswap/localization'
import { useProvider } from 'wagmi'
import { poll } from '@ethersproject/web'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useToast } from '@pancakeswap/uikit'
import { useAppDispatch } from '../index'
import { finalizeTransaction } from './actions'
import { useAllChainTransactions } from './hooks'
import { TransactionDetails } from './reducer'

export function shouldCheck(
  fetchedTransactions: { [txHash: string]: TransactionDetails },
  tx: TransactionDetails,
): boolean {
  if (tx.receipt) return false
  return !fetchedTransactions[tx.hash]
}

export const Updater: React.FC<{ chainId: number }> = ({ chainId }) => {
  const provider = useProvider({ chainId })
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const transactions = useAllChainTransactions(chainId)

  const { toastError, toastSuccess } = useToast()

  const fetchedTransactions = useRef<{ [txHash: string]: TransactionDetails }>({})

  useEffect(() => {
    if (!chainId || !provider) return

    forEach(
      pickBy(transactions, (transaction) => shouldCheck(fetchedTransactions.current, transaction)),
      (transaction) => {
        const getTransaction = async () => {
          await provider.getNetwork()

          const params = { transactionHash: provider.formatter.hash(transaction.hash, true) }

          poll(
            async () => {
              const result = await provider.perform('getTransactionReceipt', params)

              if (result == null || result.blockHash == null) {
                return undefined
              }

              const receipt = provider.formatter.receipt(result)

              dispatch(
                finalizeTransaction({
                  chainId,
                  hash: transaction.hash,
                  receipt: {
                    blockHash: receipt.blockHash,
                    blockNumber: receipt.blockNumber,
                    contractAddress: receipt.contractAddress,
                    from: receipt.from,
                    status: receipt.status,
                    to: receipt.to,
                    transactionHash: receipt.transactionHash,
                    transactionIndex: receipt.transactionIndex,
                  },
                }),
              )

              const toast = receipt.status === 1 ? toastSuccess : toastError
              toast(
                t('Transaction receipt'),
                <ToastDescriptionWithTx txHash={receipt.transactionHash} txChainId={chainId} />,
              )
              return true
            },
            { onceBlock: provider },
          )
          merge(fetchedTransactions.current, { [transaction.hash]: transactions[transaction.hash] })
        }

        getTransaction()
      },
    )
  }, [chainId, provider, transactions, dispatch, toastSuccess, toastError, t])

  return null
}

export default Updater
