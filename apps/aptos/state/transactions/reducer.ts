/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { atomWithStorage, createJSONStorage, useReducerAtom } from 'jotai/utils'
import {
  addTransaction,
  checkedTransaction,
  clearAllChainTransactions,
  clearAllTransactions,
  finalizeTransaction,
  TransactionReceipt,
  TransactionType,
} from './actions'

const now = () => Date.now()

export interface TransactionDetails {
  hash: string
  approval?: { tokenAddress: string; spender: string }
  type?: TransactionType
  summary?: string
  translatableSummary?: { text: string; data?: Record<string, string | number> }
  receipt?: TransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
}

export interface TransactionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetails
  }
}

export const initialState: TransactionState = {}

const reducer = createReducer(initialState, (builder) =>
  builder
    .addCase(
      addTransaction,
      (transactions, { payload: { chainId, from, hash, approval, summary, translatableSummary, type } }) => {
        if (transactions[chainId]?.[hash]) {
          throw Error('Attempted to add existing transaction.')
        }
        const txs = transactions[chainId] ?? {}
        txs[hash] = { hash, approval, summary, translatableSummary, from, addedTime: now(), type }
        transactions[chainId] = txs
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
    .addCase(finalizeTransaction, (transactions, { payload: { hash, chainId, receipt } }) => {
      const tx = transactions[chainId]?.[hash]
      if (!tx) {
        return
      }
      tx.receipt = receipt
      tx.confirmedTime = now()
    }),
)

const storage = createJSONStorage<TransactionState>(() => localStorage)

const transactionsAtom = atomWithStorage('transactions', initialState, storage)

export function useTransactionState() {
  return useReducerAtom(transactionsAtom, reducer)
}
