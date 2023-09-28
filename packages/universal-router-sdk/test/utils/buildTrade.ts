import { Currency, CurrencyAmount, ERC20Token, Pair, TradeType, Trade as V2Trade } from '@pancakeswap/sdk'
import { PoolType, RouteType, SmartRouterTrade, V2Pool } from '@pancakeswap/smart-router/evm'
import { Trade as V3Trade } from '@pancakeswap/v3-sdk'

export const buildV2Trade = (
  v2Trade: V2Trade<Currency, Currency, TradeType>,
  v2Pools: V2Pool[]
): SmartRouterTrade<TradeType> => {
  return {
    tradeType: v2Trade.tradeType,
    inputAmount: v2Trade.inputAmount,
    outputAmount: v2Trade.outputAmount,
    routes: [
      {
        type: RouteType.V2,
        path: v2Trade.route.path,
        inputAmount: v2Trade.inputAmount,
        outputAmount: v2Trade.outputAmount,
        percent: 100,
        pools: v2Pools,
      },
    ],
    gasEstimate: 0n,
    gasEstimateInUSD: CurrencyAmount.fromRawAmount(v2Trade.route.input, 0),
  }
}
