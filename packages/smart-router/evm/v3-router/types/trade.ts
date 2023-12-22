import { BigintIsh, Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'

import { Route } from './route'
import { PoolProvider, QuoteProvider } from './providers'
import { PoolType } from './pool'

export interface SmartRouterTrade<TTradeType extends TradeType> {
  tradeType: TTradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>

  // From routes we know how many splits and what percentage does each split take
  routes: Route[]

  gasEstimate: bigint
  gasEstimateInUSD: CurrencyAmount<Currency>
  blockNumber?: number
}

export type PriceReferences = {
  quoteCurrencyUsdPrice?: number
  nativeCurrencyUsdPrice?: number
}

export type TradeConfig = {
  gasPriceWei: BigintIsh | (() => Promise<BigintIsh>)
  blockNumber?: number | (() => Promise<number>)
  poolProvider: PoolProvider
  quoteProvider: QuoteProvider
  maxHops?: number
  maxSplits?: number
  distributionPercent?: number
  allowedPoolTypes?: PoolType[]
  quoterOptimization?: boolean
} & PriceReferences

export type RouteConfig = TradeConfig & {
  blockNumber?: number
}
