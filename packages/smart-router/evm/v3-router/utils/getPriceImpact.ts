import { CurrencyAmount, Percent, TradeType } from '@pancakeswap/sdk'

import { SmartRouterTrade } from '../types'
import { getMidPrice } from './route'

export function getPriceImpact(trade: SmartRouterTrade<TradeType>): Percent {
  let spotOutputAmount = CurrencyAmount.fromRawAmount(trade.outputAmount.currency.wrapped, 0)
  for (const route of trade.routes) {
    const { inputAmount } = route
    // FIXME typing
    const midPrice: any = getMidPrice(route)
    spotOutputAmount = spotOutputAmount.add(midPrice.quote(inputAmount.wrapped))
  }
  const priceImpact = spotOutputAmount.subtract(trade.outputAmount.wrapped).divide(spotOutputAmount)
  return new Percent(priceImpact.numerator, priceImpact.denominator)
}
