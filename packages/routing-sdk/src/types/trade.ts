import type { BigintIsh, Currency, CurrencyAmount, TradeType } from '@pancakeswap/swap-sdk-core'

import type { Pool } from './pool'
import type { Route, SerializableRoute } from './route'
import type { Graph } from './graph'
import type { GasUseEstimate, SerializableGasUseEstimate } from './gasEstimate'
import { SerializableCurrencyAmount } from './currency'

type BaseTradeConfig = {
  gasPriceWei: BigintIsh | (() => Promise<BigintIsh>)
  maxHops?: number
  maxSplits?: number
  distributionPercent?: number
}

export type TradeConfig = BaseTradeConfig & {
  candidatePools: Pool[]
}

export type BaseTrade<TTradeType extends TradeType, P extends Pool = Pool> = {
  tradeType: TTradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  routes: Route<P>[]
}

export type TradeWithGraph<TTradeType extends TradeType, P extends Pool = Pool> = BaseTrade<TTradeType, P> & {
  graph: Graph
} & GasUseEstimate

export type Trade<TTradeType extends TradeType, P extends Pool = Pool> = Omit<TradeWithGraph<TTradeType, P>, 'graph'>

export type SerializableBaseTrade = Omit<BaseTrade<TradeType>, 'inputAmount' | 'outputAmount' | 'routes'> & {
  inputAmount: SerializableCurrencyAmount
  outputAmount: SerializableCurrencyAmount
  routes: SerializableRoute[]
}

export type SerializableTrade = SerializableBaseTrade & SerializableGasUseEstimate
