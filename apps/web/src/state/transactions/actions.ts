import { createAction } from '@reduxjs/toolkit'
import { ChainId } from '@pancakeswap/sdk'
import { Order } from '@gelatonetwork/limit-orders-lib'

export type TransactionType =
  | 'approve'
  | 'swap'
  | 'wrap'
  | 'add-liquidity'
  | 'remove-liquidity'
  | 'limit-order-submission'
  | 'limit-order-cancellation'
  | 'limit-order-approval'
  | 'non-bsc-farm'

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

export enum MsgStatus {
  MS_UNKNOWN = 0,
  MS_WAITING_FOR_SGN_CONFIRMATIONS = 1,
  MS_WAITING_FOR_DESTINATION_EXECUTION = 2,
  MS_COMPLETED = 3,
  MS_FAIL = 4,
  MS_FALLBACK = 5,
}

export enum FarmTransactionStatus {
  PENDING = -1,
  FAIL = 0,
  SUCCESS = 1,
}

export enum NonBscFarmStepType {
  STAKE = 'STAKE',
  UNSTAKE = 'UNSTAKE',
}

export interface NonBscFarmTransactionStep {
  step: number
  chainId: number
  status: FarmTransactionStatus
  tx: string
  isFirstTime?: boolean
  msgStatus?: MsgStatus
}

export interface NonBscFarmTransactionType {
  type: NonBscFarmStepType
  status: FarmTransactionStatus
  amount: string
  lpAddress: string
  lpSymbol: string
  steps: NonBscFarmTransactionStep[]
}

export const addTransaction = createAction<{
  chainId: ChainId
  hash: string
  from: string
  approval?: { tokenAddress: string; spender: string }
  claim?: { recipient: string }
  summary?: string
  translatableSummary?: { text: string; data?: Record<string, string | number> }
  type?: TransactionType
  order?: Order
  nonBscFarm?: NonBscFarmTransactionType
}>('transactions/addTransaction')
export const clearAllTransactions = createAction('transactions/clearAllTransactions')
export const clearAllChainTransactions = createAction<{ chainId: ChainId }>('transactions/clearAllChainTransactions')
export const finalizeTransaction = createAction<{
  chainId: ChainId
  hash: string
  receipt: SerializableTransactionReceipt
  nonBscFarm?: NonBscFarmTransactionType
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
  chainId: ChainId
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')
