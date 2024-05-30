import type { BigintIsh, Currency, CurrencyAmount, TradeType } from '@pancakeswap/swap-sdk-core'

import type { Pool } from './pool'
import type { Route } from './route'
import type { Graph } from './graph'
import type { GasUseEstimate } from './gasEstimate'

type BaseTradeConfig = {
  gasPriceWei: BigintIsh | (() => Promise<BigintIsh>)
  maxHops?: number
  maxSplits?: number
  distributionPercent?: number
}

export type TradeConfig = BaseTradeConfig & {
  candidatePools: Pool[]
}

export type Trade<TTradeType extends TradeType> = {
  tradeType: TTradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  routes: Route[]
  graph: Graph
} & GasUseEstimate
