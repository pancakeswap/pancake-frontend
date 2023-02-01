import { TradeType } from '@pancakeswap/sdk'

import { Route } from './route'

export interface Trade<TTradeType extends TradeType> {
  tradeType: TTradeType

  // From routes we know how many splits and what percentage does each split take
  routes: Route[]
}
