import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import { AbortControl } from '@pancakeswap/utils/abortControl'

import { BaseTradeConfig, Pool, SmartRouterTrade, Route } from '../../v3-router/types'
import { Graph } from './graph'

export type GasUseInfo = {
  gasUseEstimate: bigint
  gasUseEstimateBase: CurrencyAmount<Currency>
  gasUseEstimateQuote: CurrencyAmount<Currency>
  inputAmountWithGasAdjusted: CurrencyAmount<Currency>
  outputAmountWithGasAdjusted: CurrencyAmount<Currency>
}

export type V4Route = Omit<Route, 'g'> & GasUseInfo

export type TradeConfig = Omit<BaseTradeConfig, 'poolProvider' | 'allowedPoolTypes'> & {
  candidatePools: Pool[]
} & AbortControl

export type V4Trade<TTradeType extends TradeType> = Omit<
  SmartRouterTrade<TTradeType>,
  'gasEstimateInUSD' | 'blockNumber' | 'routes' | 'gasEstimate'
> &
  GasUseInfo & {
    routes: V4Route[]
    graph: Graph
  }

export type V4TradeWithoutGraph<TTradeType extends TradeType> = Omit<V4Trade<TTradeType>, 'graph'>
