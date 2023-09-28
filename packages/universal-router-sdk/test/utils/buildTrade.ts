import { Currency, CurrencyAmount, ERC20Token, Pair, Trade, TradeType, Trade as V2Trade } from '@pancakeswap/sdk'
import { PoolType, RouteType, SmartRouterTrade, StablePool, V2Pool, V3Pool } from '@pancakeswap/smart-router/evm'
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

export const buildStableTrade = (
  input: Currency,
  amountIn: CurrencyAmount<Currency>,
  stablePools: StablePool[]
): SmartRouterTrade<TradeType> => {
  // @notice: just set same amountOut as amountIn, for easy fixture
  const amountOut = amountIn

  const path: Currency[] = [input.wrapped]

  for (const pool of stablePools) {
    const { balances } = pool
    path.push(balances[0].currency.equals(input) ? balances[1].currency : balances[0].currency)
  }

  return {
    tradeType: TradeType.EXACT_INPUT,
    inputAmount: amountIn,
    outputAmount: amountOut,
    routes: [
      {
        type: RouteType.STABLE,
        path,
        inputAmount: amountIn,
        outputAmount: amountOut,
        percent: 100,
        pools: stablePools,
      },
    ],
    gasEstimate: 0n,
    gasEstimateInUSD: CurrencyAmount.fromRawAmount(input, 0),
  }
}

export const buildV3Trade = (
  trade: V3Trade<Currency, Currency, TradeType>,
  pools: V3Pool[]
): SmartRouterTrade<TradeType> => {
  return {
    tradeType: trade.tradeType,
    inputAmount: trade.inputAmount,
    outputAmount: trade.outputAmount,
    routes: [
      {
        type: RouteType.V3,
        path: trade.swaps[0].route.tokenPath,
        inputAmount: trade.inputAmount,
        outputAmount: trade.outputAmount,
        percent: 100,
        pools,
      },
    ],
    gasEstimate: 0n,
    gasEstimateInUSD: CurrencyAmount.fromRawAmount(trade.route.input, 0),
  }
}
