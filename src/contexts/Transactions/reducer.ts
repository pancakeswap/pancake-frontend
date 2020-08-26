import { TransactionReceipt } from 'web3-core'
import { Transaction, TransactionsMap } from './types'

const ADD_TRANSACTION = 'ADD_TRANSACTION'
const RECEIVE_TX_RECEIPT = 'RECEIVE_TX_RECEIPT'
const SET_TRANSACTIONS = 'SET_TRANSACTIONS'

interface AddTransactionAction {
  type: typeof ADD_TRANSACTION,
  transaction: Transaction
}

interface ReceiveTxReceiptAction {
  type: typeof RECEIVE_TX_RECEIPT,
  txHash: string,
  receipt: TransactionReceipt
}

interface SetTransactionsAction {
  type: typeof SET_TRANSACTIONS,
  transactions: TransactionsMap
}

type TransactionsActions = AddTransactionAction | ReceiveTxReceiptAction | SetTransactionsAction

export interface TransactionsState {
  initialized: boolean,
  transactions: TransactionsMap
}

export const addTransaction = (transaction: Transaction): AddTransactionAction => ({
  type: ADD_TRANSACTION,
  transaction,
})

export const receiveTxReceipt = (txHash: string, receipt: TransactionReceipt): ReceiveTxReceiptAction => ({
  type: RECEIVE_TX_RECEIPT,
  txHash,
  receipt,
})

export const setTransactions = (transactions: TransactionsMap): SetTransactionsAction => ({
  type: SET_TRANSACTIONS,
  transactions,
})

export const initialState: TransactionsState = {
  initialized: false,
  transactions: {}
}

const reducer = (state: TransactionsState, action: TransactionsActions): TransactionsState => {
  switch (action.type) {
    case ADD_TRANSACTION:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.transaction.hash]: action.transaction,
        }
      }
    case RECEIVE_TX_RECEIPT:
      return {
        ...state,
        transactions: {
          ...state.transactions,
          [action.txHash]: {
            ...state.transactions[action.txHash],
            receipt: action.receipt,
          }
        }
      }
    case SET_TRANSACTIONS:
      return {
        ...state,
        transactions: action.transactions,
        initialized: true,
      }
    default:
      return state
  }
}

export default reducer