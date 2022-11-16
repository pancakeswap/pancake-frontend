import { Currency, CurrencyAmount, Pair, Token, Trade, TradeType } from '@pancakeswap/sdk'

import { RouteType, RouteWithStableSwap, StableSwapPair } from './types'
import { getOutputToken } from './utils/pair'

export function createStableSwapPair(pair: Pair, stableSwapAddress = ''): StableSwapPair {
  const newPair = new Pair(pair.reserve0, pair.reserve1)

  return {
    token0: newPair.token0,
    token1: newPair.token1,
    reserve0: newPair.reserve0,
    reserve1: newPair.reserve1,
    stableSwapAddress,
    involvesToken: (token) => token.equals(newPair.token0) || token.equals(newPair.token1),
  }
}

export function isStableSwapPair(pair: any): pair is StableSwapPair {
  return !!(pair as StableSwapPair).stableSwapAddress
}

export function createRouteWithStableSwap<TInput extends Currency, TOutput extends Currency>({
  routeType,
  input,
  pairs,
  output,
}: {
  routeType: RouteType
  pairs: (Pair | StableSwapPair)[]
  input: TInput
  output: TOutput
}): RouteWithStableSwap<TInput, TOutput> {
  const wrappedInput = input.wrapped

  const path: Token[] = [wrappedInput]
  for (const [i, pair] of pairs.entries()) {
    const out = getOutputToken(pair, path[i])
    path.push(out)
  }
  return {
    routeType,
    input,
    output,
    pairs,
    path,
  }
}

interface Options<TInput extends Currency, TOutput extends Currency, TTradeType extends TradeType> {
  routeType: RouteType
  pairs: (Pair | StableSwapPair)[]
  inputAmount: CurrencyAmount<TInput>
  outputAmount: CurrencyAmount<TOutput>
  tradeType: TTradeType
}

export function createTradeWithStableSwap<TInput extends Currency, TOutput extends Currency>({
  routeType,
  pairs,
  inputAmount,
  outputAmount,
  tradeType,
}: Options<TInput, TOutput, TradeType>) {
  return {
    tradeType,
    inputAmount,
    outputAmount,
    route: createRouteWithStableSwap({
      routeType,
      pairs,
      input: inputAmount.currency,
      output: outputAmount.currency,
    }),
  }
}

export function createTradeWithStableSwapFromV2Trade<TIn extends Currency, TOut extends Currency>({
  tradeType,
  inputAmount,
  outputAmount,
  route: { pairs },
}: Trade<TIn, TOut, TradeType>) {
  return createTradeWithStableSwap({
    routeType: RouteType.V2,
    pairs,
    inputAmount,
    outputAmount,
    tradeType,
  })
}
