import { Toast } from '@pancakeswap-libs/uikit'
import BigNumber from 'bignumber.js'
import { FarmConfig, Nft, PoolConfig } from 'config/constants/types'

export interface Farm extends FarmConfig {
  tokenAmount?: BigNumber
  quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
  userData?: {
    allowance: BigNumber
    tokenBalance: BigNumber
    stakedBalance: BigNumber
    earnings: BigNumber
  }
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  startBlock?: number
  endBlock?: number
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}

export interface Team {
  id?: number
  name: string
  description: string
  points: number
  users: number
  isJoinable: boolean
}

export interface Profile {
  userId: number
  numberPoints: number
  teamId: number
  nftAddress: string
  tokenId: number
  isActive: boolean
  username: string
  nft: Nft
  team: Team
}

// Slices states

export interface ToastsState {
  data: Toast[]
}

export interface FarmsState {
  data: Farm[]
}

export interface PoolsState {
  data: Pool[]
}

export interface ProfileState {
  isInitialized: boolean
  isLoading: boolean
  data: Profile
}

// Global state

export interface State {
  farms: FarmsState
  toasts: ToastsState
  pools: PoolsState
  profile: ProfileState
}
