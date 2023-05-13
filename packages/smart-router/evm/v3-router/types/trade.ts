import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'

import { Route } from './route'

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
