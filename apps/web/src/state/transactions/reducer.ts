/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { LimitOrder } from 'state/limitOrders/types'
import { confirmOrderCancellation, confirmOrderSubmission, saveOrder } from 'utils/localStorageOrders'
import { Hash } from 'viem'
import { atomWithStorage, createJSONStorage, useReducerAtom } from 'jotai/utils'
import {
  addTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
  SerializableTransactionReceipt,
  TransactionType,
  clearAllChainTransactions,
  NonBscFarmTransactionType,
  FarmTransactionStatus,
} from './actions'
import { resetUserState } from '../global/actions'

export interface TransactionDetails {
  hash: Hash
  approval?: { tokenAddress: string; spender: string }
  type?: TransactionType
  order?: LimitOrder
  summary?: string
  translatableSummary?: { text: string; data?: Record<string, string | number> }
  claim?: { recipient: string }
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  nonBscFarm?: NonBscFarmTransactionType
}

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails
  }
}

export const initialState: TransactionState = {}

export const transactionReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(
      addTransaction,
      (
        transactions,
        { payload: { chainId, from, hash, approval, summary, translatableSummary, claim, type, order, nonBscFarm } },
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
          addedTime: Date.now(),
          type,
          order,
          nonBscFarm,
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
    .addCase(finalizeTransaction, (transactions, { payload: { hash, chainId, receipt, nonBscFarm } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = Date.now()

      if (tx.type === 'limit-order-submission') {
        confirmOrderSubmission(chainId, receipt.from, hash, receipt.status !== 0)
      } else if (tx.type === 'limit-order-cancellation') {
        confirmOrderCancellation(chainId, receipt.from, hash, receipt.status !== 0)
      } else if (tx.type === 'non-bsc-farm') {
        if (tx?.nonBscFarm?.steps?.[0]?.status === FarmTransactionStatus.PENDING) {
          if (receipt.status === FarmTransactionStatus.FAIL) {
            tx.nonBscFarm = { ...tx.nonBscFarm, status: receipt.status }
          }

          tx.nonBscFarm.steps[0] = {
            ...tx.nonBscFarm.steps[0],
            status: receipt.status,
          }
        } else {
          tx.nonBscFarm = nonBscFarm
        }
      }
    })
    .addCase(resetUserState, (transactions, { payload: { chainId, newChainId } }) => {
      if (!newChainId && transactions[chainId]) {
        transactions[chainId] = {}
      }
    }),
)

const storage = createJSONStorage<TransactionState>(() => localStorage)

const transactionsAtom = atomWithStorage('pcs:transactions', initialState, storage)

export function useTransactionState() {
  return useReducerAtom(transactionsAtom, transactionReducer)
}
