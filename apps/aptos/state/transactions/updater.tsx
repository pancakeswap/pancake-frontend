import { useLedger } from '@pancakeswap/awgmi'
import { isUserTransaction } from '@pancakeswap/awgmi/core'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useEffect } from 'react'
import { checkedTransaction, finalizeTransaction } from './actions'
import { useAllChainTransactions } from './hooks'
import { useTransactionState } from './reducer'

export function shouldCheck(
  currentBlock: number,
  tx: { addedTime: number; receipt?: any; lastCheckedBlockNumber?: number },
): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = currentBlock - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  }
  if (minutesPending > 5) {
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  }
  // otherwise every block
  return true
}

export default function Updater(): null {
  const { chainId, provider } = useActiveWeb3React()
  const { t } = useTranslation()

  const { data } = useLedger()

  const currentBlock = data?.block_height && +data.block_height

  const [, dispatch] = useTransactionState()
  const transactions = useAllChainTransactions()

  const { toastError, toastSuccess } = useToast()

  useEffect(() => {
    if (!chainId || !provider || !currentBlock) return

    Object.keys(transactions)
      .filter((hash) => shouldCheck(currentBlock, transactions[hash]))
      .forEach((hash) => {
        provider
          .waitForTransactionWithResult(hash)
          .then((receipt) => {
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
            } else {
              dispatch(checkedTransaction({ chainId, hash, blockNumber: currentBlock }))
            }
          })
          .catch((error) => {
            console.error(`failed to check transaction hash: ${hash}`, error)
          })
      })
  }, [chainId, provider, transactions, currentBlock, dispatch, toastSuccess, toastError, t])

  return null
}
