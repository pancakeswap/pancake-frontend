import { Currency, CurrencyAmount, ERC20Token, Native, Pair, TradeType, Trade as V2Trade } from '@pancakeswap/sdk'
import {
  RouteType,
  SmartRouter,
  SmartRouterTrade,
  StablePool,
  StableSwap,
  V2Pool,
  V3Pool,
} from '@pancakeswap/smart-router/evm'
import { Pool, Trade as V3Trade } from '@pancakeswap/v3-sdk'
import { convertPairToV2Pool, convertPoolToV3Pool } from '../fixtures/address'

export const buildV2Trade = (
  v2Trade: V2Trade<Currency, Currency, TradeType>,
  v2Pools: V2Pool[],
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
  output: Currency,
  amountIn: CurrencyAmount<Currency>,
  stablePools: StablePool[],
): SmartRouterTrade<TradeType> => {
  // @notice: just set same amountOut quantity as amountIn, for easy fixture
  const amountOut = CurrencyAmount.fromFractionalAmount(output, amountIn.numerator, amountIn.denominator)
  const path: Currency[] = [input]
  let current = input

  for (const pool of stablePools) {
    const { balances } = pool
    current = balances[0].currency.equals(current) ? balances[1].currency : balances[0].currency
    path.push(current)
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
  pools: V3Pool[],
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

export const buildMixedRouteTrade = async <
  TInput extends Currency,
  TOutput extends Currency,
  TTradeType extends TradeType,
>(
  tokenIn: TInput,
  amount: CurrencyAmount<TTradeType extends TradeType.EXACT_INPUT ? TInput : TOutput>,
  tradeType: TTradeType,
  pools: Array<Pair | Pool | StablePool>,
  isOutputNative = true,
): Promise<SmartRouterTrade<TradeType>> => {
  const path: Currency[] = [tokenIn.wrapped]
  const outputPools = pools.map((pool) => {
    if (pool instanceof Pair) return convertPairToV2Pool(pool)
    if (pool instanceof Pool) return convertPoolToV3Pool(pool)

    return pool
  })

  const amounts: CurrencyAmount<Currency>[] = []

  amounts.push(amount.wrapped)

  for (const pool of pools) {
    const input = amounts[amounts.length - 1]
    let outputAmount: CurrencyAmount<Currency>
    if (pool instanceof Pair || pool instanceof Pool) {
      // eslint-disable-next-line no-await-in-loop
      ;[outputAmount] = await pool.getOutputAmount(input as CurrencyAmount<ERC20Token>)
      path.push(outputAmount.currency)
      amounts.push(outputAmount)
    } else if (SmartRouter.isStablePool(pool)) {
      const { amplifier, balances, fee } = pool
      outputAmount = StableSwap.getSwapOutput({
        amplifier,
        amount: input,
        balances,
        fee,
        outputCurrency: balances[0].currency.equals(input.currency) ? balances[1].currency : balances[0].currency,
      }).wrapped
      path.push(outputAmount.currency)
      amounts.push(outputAmount)
    }
  }

  // mixed Router support exactIn only
  const inputAmount = amount
  let outputAmount = amounts[amounts.length - 1]
  const nativeCurrency = Native.onChain(outputAmount.currency.chainId)
  // is wrapped token
  if (outputAmount.currency.wrapped.equals(nativeCurrency.wrapped) && isOutputNative) {
    outputAmount = CurrencyAmount.fromFractionalAmount(nativeCurrency, outputAmount.numerator, outputAmount.denominator)
  }
  return {
    tradeType,
    inputAmount: amount,
    outputAmount: isOutputNative ? outputAmount : outputAmount.wrapped,
    routes: [
      {
        type: RouteType.MIXED,
        path,
        pools: outputPools,
        inputAmount,
        outputAmount,
        percent: 100,
      },
    ],
    gasEstimate: 0n,
    gasEstimateInUSD: CurrencyAmount.fromRawAmount(tokenIn, 0),
  }
}
