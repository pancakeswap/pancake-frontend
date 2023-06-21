import { Currency, CurrencyAmount, Percent, Price } from '@pancakeswap/sdk'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { Address, Hash } from 'viem'

import { MANAGER, BaseManager } from './constants/managers'

export enum OnChainActionType {
  ADD_LIQUIDITY,
  REMOVE_LIQUIDITY,
  HARVEST,
}

export enum Strategy {
  TYPICAL_WIDE,
}

export interface OnChainActionResponse {
  txHash: Hash
}

export enum ManagerFeeType {
  LP_REWARDS,
}

export interface ManagerFee {
  type: ManagerFeeType
  rate: Percent
}

export interface Position {
  positionId: string
  liquidity: bigint
  tickUpper: number
  tickLower: number
}

export interface RebalanceHistory {
  // Timestamp
  at: number

  price: Price<Currency, Currency>

  // For 3rd party vaults, they might hold 100% of the assets
  // instead of providing liquidity
  position: Position | null
}

export interface BaseAssets {
  position: Position | null

  // Remaining token amounts hold by the position manager
  // Happens with 3rd party position managers when their strategy is
  // partially staking assets while utilizing remaining assets via other channel
  amounts?: CurrencyAmount<Currency>[]
}

// For position manager instance, the required context should contain both
// manager config and the user wallet client (signer)
export interface BasePositionManager<A extends BaseAssets> extends BaseManager {
  addLiquidity: (params: { amounts: CurrencyAmount<Currency>[]; slippage?: Percent }) => Promise<OnChainActionResponse>
  removeLiquidity: (params: {
    // The total assets that user currently owns
    assets: A
    percentage: Percent
    slippage?: Percent
  }) => Promise<OnChainActionResponse>

  // Get the contract address of specific on chain fund action
  // Mainly used for token approval
  getOnChainActionAgent: (actionType: OnChainActionType) => Address

  // Get the total assets currently being managed.
  // Position will change from time to time
  getTotalAssets: () => Promise<A & { rebalancedAt?: number }>

  // Get the assets share of the current user account in this vault
  getAccountShare: () => Promise<A | null>

  getRebalanceHistory: () => Promise<RebalanceHistory[]>
}

export interface FarmReward {
  amount: CurrencyAmount<Currency>
}

export interface PCSPositionManager extends BasePositionManager<BaseAssets> {
  // Only available on vault with farm
  harvest?: () => Promise<OnChainActionResponse>

  getFarmRewards?: () => Promise<FarmReward | null>
}

export type PositionManager = PCSPositionManager

// Duo token position
export interface DuoTokenVault {
  // The unique id of the vault
  // It can be used to sort the managed positions on fe
  id: number
  name: string
  currencyA: Currency
  currencyB: Currency
  feeTier: FeeAmount

  manager: PositionManager
  strategy: Strategy
  managerFee: ManagerFee
}

export interface PCSDuoTokenVault extends DuoTokenVault {
  address: Address
  autoCompound?: boolean

  // Auto farm with lp
  autoFarm?: boolean
}

export type Vault = PCSDuoTokenVault

export interface PCSDuoTokenVaultConfig extends Omit<PCSDuoTokenVault, 'manager'> {
  manager: MANAGER
}

export type VaultConfig = PCSDuoTokenVaultConfig
