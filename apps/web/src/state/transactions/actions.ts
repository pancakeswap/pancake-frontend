import { Order } from '@gelatonetwork/limit-orders-lib'
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
  | 'cross-chain-farm'
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

export enum CrossChainFarmStepType {
  STAKE = 'STAKE',
  UNSTAKE = 'UNSTAKE',
}

export interface CrossChainFarmTransactionStep {
  step: number
  chainId: number
  status: FarmTransactionStatus
  tx: string
  isFirstTime?: boolean
  msgStatus?: MsgStatus
}

export interface CrossChainFarmTransactionType {
  type: CrossChainFarmStepType
  status: FarmTransactionStatus
  amount: string
  lpAddress: string
  lpSymbol: string
  steps: CrossChainFarmTransactionStep[]
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
  order?: Order
  crossChainFarm?: CrossChainFarmTransactionType
}>('transactions/addTransaction')
export const clearAllTransactions = createAction('transactions/clearAllTransactions')
export const clearAllChainTransactions = createAction<{ chainId: ChainId }>('transactions/clearAllChainTransactions')
export const finalizeTransaction = createAction<{
  chainId: ChainId
  hash: string
  receipt: SerializableTransactionReceipt
  crossChainFarm?: CrossChainFarmTransactionType
}>('transactions/finalizeTransaction')
export const checkedTransaction = createAction<{
  chainId: ChainId
  hash: string
  blockNumber: number
}>('transactions/checkedTransaction')
