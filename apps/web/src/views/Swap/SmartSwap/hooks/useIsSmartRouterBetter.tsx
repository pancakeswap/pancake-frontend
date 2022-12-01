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
    !trade.outputAmount.currency.equals(v2Trade.outputAmount.currency)
  ) {
    return false
  }

  return trade.route.routeType !== RouteType.V2 && trade.outputAmount.greaterThan(v2Trade.outputAmount)
}
