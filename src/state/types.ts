import BigNumber from 'bignumber.js'
import { FarmConfig, PoolConfig } from 'sushi/lib/constants/types'

export interface FarmLP extends FarmConfig {
  tokenAmount?: BigNumber
  quoteTokenAmount?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
}

export interface Pool extends PoolConfig {
  totalStaked?: BigNumber
  startBlock?: number
  endBlock?: number
}

// Slices states

export interface FarmsState {
  data: FarmLP[]
}

export interface PoolsState {
  data: Pool[]
}

// Global state

export interface State {
  farms: FarmsState
  pools: PoolsState
}
