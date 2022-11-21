import { Currency, Trade, TradeType } from '@pancakeswap/sdk'
import { RouteType, TradeWithStableSwap } from '@pancakeswap/smart-router/evm'

interface Options {
  trade?: TradeWithStableSwap<Currency, Currency, TradeType> | null
  v2Trade?: Trade<Currency, Currency, TradeType> | null
}

export const useIsSmartRouterBetter = ({ trade, v2Trade }: Options) => {
  let isSmartRouterBetter = false
  if (trade && v2Trade && trade.route.routeType !== RouteType.V2) {
    if (trade.outputAmount.greaterThan(v2Trade.outputAmount)) isSmartRouterBetter = true
  }
  return isSmartRouterBetter
}
