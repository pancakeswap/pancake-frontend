import { Currency } from '@pancakeswap/swap-sdk-core'
import { Address, Hash } from 'viem'

export enum SortField {
  TransactionValue = 'amountUSD',
  Account = 'sender',
  Timestamp = 'timestamp',
}

export enum TransactionType {
  Swap,
  Add,
  Remove,
}

export type Transaction = {
  id: string
  type: TransactionType
  transactionHash: Hash
  sender: Address
  poolId: Address
  token0: Currency
  token1: Currency
  amountUSD: number
  amount0: number
  amount1: number
  /**
   * Unix timestamp
   * the number of seconds since the Unix Epoch
   */
  timestamp: number
}

export enum SortDirection {
  IDLE,
  Descending,
  Ascending,
}
