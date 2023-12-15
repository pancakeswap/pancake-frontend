import { Token } from '@pancakeswap/sdk'
import { Address } from 'viem'

export enum PredictionSupportedSymbol {
  BNB = 'BNB',
  CAKE = 'CAKE',
  ETH = 'ETH',
  WETH = 'WETH',
  WBTC = 'WBTC',
}

export enum BetPosition {
  BULL = 'Bull',
  BEAR = 'Bear',
  HOUSE = 'House',
}

export enum PredictionStatus {
  INITIAL = 'initial',
  LIVE = 'live',
  PAUSED = 'paused',
  ERROR = 'error',
}

export enum PredictionsChartView {
  TradingView = 'TradingView',
  Chainlink = 'Chainlink Oracle',
}

export interface PredictionConfig {
  isNativeToken: boolean
  address: Address
  api: string
  chainlinkOracleAddress?: Address // All EVM chain are using chainlink oracle, but not include zkSync chain.
  galetoOracleAddress?: Address // Only zkSync chain use galeto oracle.
  displayedDecimals: number
  token: Token
}
