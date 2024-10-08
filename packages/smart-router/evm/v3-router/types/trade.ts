import { BigintIsh, Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { AbortControl } from '@pancakeswap/utils/abortControl'

import { PoolType } from './pool'
import { PoolProvider, QuoteProvider } from './providers'
import { Route } from './route'

export interface SmartRouterTrade<TTradeType extends TradeType> {
  tradeType: TTradeType
  inputAmount: CurrencyAmount<Currency>
  inputAmountWithGasAdjusted?: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  outputAmountWithGasAdjusted?: CurrencyAmount<Currency>

  // From routes we know how many splits and what percentage does each split take
  routes: Route[]

  gasEstimate: bigint
  gasEstimateInUSD?: CurrencyAmount<Currency>
  blockNumber?: number
}

export type PriceReferences = {
  quoteCurrencyUsdPrice?: number
  nativeCurrencyUsdPrice?: number
}

export type BaseTradeConfig = {
  gasPriceWei: BigintIsh | (() => Promise<BigintIsh>)
  maxHops?: number
  maxSplits?: number
  distributionPercent?: number
  allowedPoolTypes?: PoolType[]
  poolProvider: PoolProvider
}

export type TradeConfig = BaseTradeConfig & {
  blockNumber?: number | (() => Promise<number>)
  quoteProvider: QuoteProvider
  quoterOptimization?: boolean
} & PriceReferences &
  AbortControl

export type RouteConfig = TradeConfig & {
  blockNumber?: number
}
