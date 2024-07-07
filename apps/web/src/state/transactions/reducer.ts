/* eslint-disable no-param-reassign */
import { Order } from '@gelatonetwork/limit-orders-lib'
import { createReducer } from '@reduxjs/toolkit'
import { confirmOrderCancellation, confirmOrderSubmission, saveOrder } from 'utils/localStorageOrders'
import { Hash } from 'viem'
import { resetUserState } from '../global/actions'
import {
  FarmTransactionStatus,
  CrossChainFarmTransactionType,
  SerializableTransactionReceipt,
  TransactionType,
  addTransaction,
  checkedTransaction,
  clearAllChainTransactions,
  clearAllTransactions,
  finalizeTransaction,
} from './actions'

const now = () => Date.now()

export interface TransactionDetails {
  hash: Hash
  approval?: { tokenAddress: string; spender: string; amount?: string }
  type?: TransactionType
  order?: Order
  summary?: string
  translatableSummary?: { text: string; data?: Record<string, string | number | undefined> }
  claim?: { recipient: string }
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  crossChainFarm?: CrossChainFarmTransactionType
}

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails
  }
}

export const initialState: TransactionState = {}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      addTransaction,
      (
        transactions,
        {
          payload: { chainId, from, hash, approval, summary, translatableSummary, claim, type, order, crossChainFarm },
        },
      ) => {
        if (transactions[chainId]?.[hash]) {
          throw Error('Attempted to add existing transaction.')
        }
        const txs = transactions[chainId] ?? {}
        txs[hash as Hash] = {
          hash: hash as Hash,
          approval,
          summary,
          translatableSummary,
          claim,
          from,
          addedTime: now(),
          type,
          order,
          crossChainFarm,
        }
        transactions[chainId] = txs
        if (order) saveOrder(chainId, from, order, true)
      },
    )
    .addCase(clearAllTransactions, () => {
      return {}
    })
    .addCase(clearAllChainTransactions, (transactions, { payload: { chainId } }) => {
      if (!transactions[chainId]) return
      transactions[chainId] = {}
    })
    .addCase(checkedTransaction, (transactions, { payload: { chainId, hash, blockNumber } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      if (!tx.lastCheckedBlockNumber) {
        tx.lastCheckedBlockNumber = blockNumber
      } else {
        tx.lastCheckedBlockNumber = Math.max(blockNumber, tx.lastCheckedBlockNumber)
      }
    })
    .addCase(finalizeTransaction, (transactions, { payload: { hash, chainId, receipt, crossChainFarm } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = now()

      if (tx.type === 'limit-order-submission') {
        confirmOrderSubmission(chainId, receipt.from, hash, receipt.status !== 0)
      } else if (tx.type === 'limit-order-cancellation') {
        confirmOrderCancellation(chainId, receipt.from, hash, receipt.status !== 0)
      } else if (tx.type === 'cross-chain-farm') {
        if (tx.crossChainFarm?.steps[0].status === FarmTransactionStatus.PENDING) {
          if (receipt.status === FarmTransactionStatus.FAIL) {
            tx.crossChainFarm = { ...tx.crossChainFarm, status: receipt.status }
          }

          tx.crossChainFarm.steps[0] = {
            ...tx.crossChainFarm.steps[0],
            status: receipt.status ?? FarmTransactionStatus.PENDING,
          }
        } else {
          tx.crossChainFarm = crossChainFarm
        }
      }
    })
    .addCase(resetUserState, (transactions, { payload: { chainId, newChainId } }) => {
      if (!newChainId && transactions[chainId]) {
        transactions[chainId] = {}
      }
    }),
)
