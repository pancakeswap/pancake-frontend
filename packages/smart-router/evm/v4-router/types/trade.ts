import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { AbortControl } from '@pancakeswap/utils/abortControl'

import { BaseTradeConfig, Pool, SmartRouterTrade, Route } from '../../v3-router/types'
import { Graph } from './graph'

export type V4Route = Route & {
  gasCost: bigint
  gasCostInBase: CurrencyAmount<Currency>
  gasCostInQuote: CurrencyAmount<Currency>
  inputAmountWithGasAdjusted: CurrencyAmount<Currency>
  outputAmountWithGasAdjusted: CurrencyAmount<Currency>
}

export type TradeConfig = Omit<BaseTradeConfig, 'poolProvider' | 'allowedPoolTypes'> & {
  candidatePools: Pool[]
} & AbortControl

export type V4Trade<TTradeType extends TradeType> = Omit<
  SmartRouterTrade<TTradeType>,
  'gasEstimateInUSD' | 'blockNumber' | 'routes'
> & {
  routes: V4Route[]
  graph: Graph
  gasCostInQuote: CurrencyAmount<Currency>
  gasCostInBase: CurrencyAmount<Currency>
  inputAmountWithGasAdjusted: CurrencyAmount<Currency>
  outputAmountWithGasAdjusted: CurrencyAmount<Currency>
}
