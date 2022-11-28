import { Currency, Trade, TradeType } from '@pancakeswap/sdk'
import { RouteType, TradeWithStableSwap } from '@pancakeswap/smart-router/evm'

interface Options {
  trade?: TradeWithStableSwap<Currency, Currency, TradeType> | null
  v2Trade?: Trade<Currency, Currency, TradeType> | null
}

export const useIsSmartRouterBetter = ({ trade, v2Trade }: Options) => {
  if (!trade || !v2Trade) {
    return false
  }

  // trade might be outdated when currencies changed
  if (
    !trade.inputAmount.currency.equals(v2Trade.inputAmount.currency) ||
    !trade.outputAmount.currency.equals(v2Trade.outputAmount.currency) ||
    // Trade is cached so when changing the input, trade might be outdated
    (trade.tradeType === v2Trade.tradeType && !trade.inputAmount.equalTo(v2Trade.inputAmount)) ||
    // Trade should share the same path with v2 trade
    !isSamePath(trade.route.path, v2Trade.route.path)
  ) {
    return false
  }

  return trade.route.routeType !== RouteType.V2 && trade.outputAmount.greaterThan(v2Trade.outputAmount)
}

function isSamePath(one: Currency[], another: Currency[]) {
  if (one.length !== another.length) {
    return false
  }
  for (let i = 0; i < one.length; i += 1) {
    if (!one[i].equals(another[i])) {
      return false
    }
  }
  return true
}
