import BigNumber from 'bignumber.js'
import { FarmConfig, PoolConfig } from 'config/constants/types'

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

export enum AlertType {
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info',
}

export interface Alert {
  id: string
  type: AlertType
  title: string
  description?: string
}

// Slices states

export interface FarmsState {
  data: Farm[]
}

export interface PoolsState {
  data: Pool[]
}

export interface AlertsState {
  data: Alert[]
}

// Global state

export interface State {
  alerts: AlertsState
  farms: FarmsState
  pools: PoolsState
}
