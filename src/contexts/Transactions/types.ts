import { TransactionReceipt } from 'web3-core'

export interface Transaction {
  description: string
  hash: string
  receipt?: TransactionReceipt
}

export interface TransactionsMap {
  [key: string]: Transaction
}
