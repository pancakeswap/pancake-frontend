import { ChainId } from '@pancakeswap/sdk'
import type { Provider } from '@ethersproject/providers'
import { SerializedWrappedToken } from '@pancakeswap/token-lists'

export type OnChainProvider = ({ chainId }: { chainId?: ChainId }) => Provider

export type SerializedBigNumber = string

export interface Address {
  [chainId: number]: string
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
  'AUTO' = 'Auto',
}

export interface PoolConfigBaseProps {
  sousId: number
  contractAddress: Address
  poolCategory: PoolCategory
  tokenPerBlock: string
  isFinished?: boolean
  enableEmergencyWithdraw?: boolean
  version?: number
}

interface GenericToken {
  decimals: number
  symbol: string
  address: string
}

export interface SerializedPoolConfig<T> extends PoolConfigBaseProps {
  earningToken: T & GenericToken
  stakingToken: T & GenericToken
}

export type SerializedPool = SerializedPoolConfig<SerializedWrappedToken>

export interface SerializedVaultUser {
  isLoading: boolean
  userShares: SerializedBigNumber
  cakeAtLastUserAction: SerializedBigNumber
  lastDepositedTime: string
  lastUserActionTime: string
}

export interface SerializedLockedVaultUser extends SerializedVaultUser {
  lockStartTime: string
  lockEndTime: string
  userBoostedShare: SerializedBigNumber
  locked: boolean
  lockedAmount: SerializedBigNumber
  currentPerformanceFee: SerializedBigNumber
  currentOverdueFee: SerializedBigNumber
}
