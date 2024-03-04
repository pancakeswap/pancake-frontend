import { ChainId } from '@pancakeswap/chains'
import { createAction } from '@reduxjs/toolkit'

export type TransactionType =
  | 'approve'
  | 'swap'
  | 'wrap'
  | 'add-liquidity'
  | 'increase-liquidity-v3'
  | 'add-liquidity-v3'
  | 'remove-liquidity-v3'
  | 'collect-fee'
  | 'remove-liquidity'
  | 'limit-order-submission'
  | 'limit-order-cancellation'
  | 'limit-order-approval'
  | 'non-bsc-farm'
  | 'migrate-v3'
  | 'bridge-icake'
  | 'claim-liquid-staking'

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export const addTransaction = createAction<{
  chainId: ChainId
  hash: string
  from: string
  approval?: { tokenAddress: string; spender: string }
  claim?: { recipient: string }
  summary?: string
  translatableSummary?: { text: string; data?: Record<string, string | number | undefined> }
  type?: TransactionType
}>('transactions/addTransaction')
export const clearAllTransactions = createAction('transactions/clearAllTransactions')
export const clearAllChainTransactions = createAction<{ chainId: ChainId }>('transactions/clearAllChainTransactions')
export const finalizeTransaction = createAction<{
  chainId: ChainId
  hash: string
  receipt: SerializableTransactionReceipt
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
  chainId: ChainId
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')
