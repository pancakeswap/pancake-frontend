import { ChainId, AVERAGE_CHAIN_BLOCK_TIMES } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import { BSC_BLOCK_TIME } from 'config'
import forEach from 'lodash/forEach'
import merge from 'lodash/merge'
import pickBy from 'lodash/pickBy'
import React, { useEffect, useRef } from 'react'
import { useAppDispatch } from 'state'
import { RetryableError, retry } from 'state/multicall/retry'
import {
  BlockNotFoundError,
  TransactionNotFoundError,
  TransactionReceiptNotFoundError,
  WaitForTransactionReceiptTimeoutError,
} from 'viem'
import { usePublicClient } from 'wagmi'
import { useFetchBlockData } from '@pancakeswap/wagmi'
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
  const provider = usePublicClient({ chainId })
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const transactions = useAllChainTransactions(chainId)
  const refetchBlockData = useFetchBlockData(chainId)

  const { toastError, toastSuccess } = useToast()

  const fetchedTransactions = useRef<{ [txHash: string]: TransactionDetails }>({})

  useEffect(() => {
    if (!chainId || !provider) return

    forEach(
      pickBy(transactions, (transaction) => shouldCheck(fetchedTransactions.current, transaction)),
      (transaction) => {
        const getTransaction = async () => {
          try {
            const receipt: any = await provider.getTransactionReceipt({ hash: transaction.hash })

            dispatch(
              finalizeTransaction({
                chainId,
                hash: transaction.hash,
                receipt: {
                  blockHash: receipt.blockHash,
                  blockNumber: Number(receipt.blockNumber),
                  contractAddress: receipt.contractAddress,
                  from: receipt.from,
                  status: receipt.status === 'success' ? 1 : 0,
                  to: receipt.to,
                  transactionHash: receipt.transactionHash,
                  transactionIndex: receipt.transactionIndex,
                },
              }),
            )
            const toast = receipt.status === 'success' ? toastSuccess : toastError
            if (receipt.status === 'success') {
              refetchBlockData()
            }
            toast(
              t('Transaction receipt'),
              <ToastDescriptionWithTx txHash={receipt.transactionHash} txChainId={chainId} />,
            )
          } catch (error) {
            console.error(error)
            if (error instanceof TransactionNotFoundError) {
              throw new RetryableError(`Transaction not found: ${transaction.hash}`)
            } else if (error instanceof TransactionReceiptNotFoundError) {
              throw new RetryableError(`Transaction receipt not found: ${transaction.hash}`)
            } else if (error instanceof BlockNotFoundError) {
              throw new RetryableError(`Block not found for transaction: ${transaction.hash}`)
            } else if (error instanceof WaitForTransactionReceiptTimeoutError) {
              throw new RetryableError(`Timeout reached when fetching transaction receipt: ${transaction.hash}`)
            }
          } finally {
            merge(fetchedTransactions.current, { [transaction.hash]: transactions[transaction.hash] })
          }
        }
        retry(getTransaction, {
          n: 10,
          minWait: 5000,
          maxWait: 10000,
          delay: (AVERAGE_CHAIN_BLOCK_TIMES[chainId as ChainId] ?? BSC_BLOCK_TIME) * 1000 + 1000,
        })
      },
    )
  }, [chainId, provider, transactions, dispatch, toastSuccess, toastError, t, refetchBlockData])

  return null
}

export default Updater
