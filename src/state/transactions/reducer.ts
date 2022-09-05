/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'
import { Order } from '@gelatonetwork/limit-orders-lib'
import { confirmOrderCancellation, confirmOrderSubmission, saveOrder } from 'utils/localStorageOrders'
import {
  addTransaction,
  checkedTransaction,
  clearAllTransactions,
  finalizeTransaction,
  toggleFarmHarvestModal,
  pickFarmHarvestTx,
  SerializableTransactionReceipt,
  TransactionType,
  FarmHarvestTransactionType,
} from './actions'
import { resetUserState } from '../global/actions'

const now = () => new Date().getTime()

export interface TransactionDetails {
  hash: string
  approval?: { tokenAddress: string; spender: string }
  type?: TransactionType
  order?: Order
  summary?: string
  translatableSummary?: { text: string; data?: Record<string, string | number> }
  claim?: { recipient: string }
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  addedTime: number
  confirmedTime?: number
  from: string
  farmHarvest?: { sourceChain: FarmHarvestTransactionType; destinationChain: FarmHarvestTransactionType }
}

export interface TransactionState {
  showFarmHarvestModal: boolean
  pickedFarmHarvestModalTx: string
  [chainId: number]: {
    [txHash: string]: TransactionDetails
  }
}

export const initialState: TransactionState = {
  showFarmHarvestModal: false,
  pickedFarmHarvestModalTx: '',
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(
      addTransaction,
      (
        transactions,
        { payload: { chainId, from, hash, approval, summary, translatableSummary, claim, type, order, farmHarvest } },
      ) => {
        if (transactions[chainId]?.[hash]) {
          throw Error('Attempted to add existing transaction.')
        }
        const txs = transactions[chainId] ?? {}
        txs[hash] = {
          hash,
          approval,
          summary,
          translatableSummary,
          claim,
          from,
          addedTime: now(),
          type,
          order,
          farmHarvest,
        }
        transactions[chainId] = txs
        if (order) saveOrder(chainId, from, order, true)
      },
    )
    .addCase(clearAllTransactions, (transactions, { payload: { chainId } }) => {
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

      if (transactions[chainId]?.[hash].type === 'limit-order-submission') {
        confirmOrderSubmission(chainId, receipt.from, hash, receipt.status !== 0)
      } else if (transactions[chainId]?.[hash].type === 'limit-order-cancellation') {
        confirmOrderCancellation(chainId, receipt.from, hash, receipt.status !== 0)
      }
    })
    .addCase(resetUserState, (transactions, { payload: { chainId } }) => {
      if (transactions[chainId]) {
        transactions[chainId] = {}
      }
    })
    .addCase(toggleFarmHarvestModal, (state, { payload: { showModal } }) => {
      state.showFarmHarvestModal = showModal
    })
    .addCase(pickFarmHarvestTx, (state, { payload: { tx } }) => {
      state.pickedFarmHarvestModalTx = tx
      state.showFarmHarvestModal = true
    }),
)
