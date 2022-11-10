import { Currency, CurrencyAmount, Pair, Token, TradeType } from '@pancakeswap/sdk'

import { RouteWithStableSwap, StableSwapPair } from './types'
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
  input,
  pairs,
  output,
}: {
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
    input,
    output,
    pairs,
    path,
  }
}

interface Options<TInput extends Currency, TOutput extends Currency, TTradeType extends TradeType> {
  pairs: (Pair | StableSwapPair)[]
  inputAmount: CurrencyAmount<TInput>
  outputAmount: CurrencyAmount<TOutput>
  tradeType: TTradeType
}

export function createTradeWithStableSwap<TInput extends Currency, TOutput extends Currency>({
  pairs,
  inputAmount,
  outputAmount,
  tradeType,
}: Options<TInput, TOutput, TradeType.EXACT_INPUT> | Options<TOutput, TInput, TradeType.EXACT_OUTPUT>) {
  return {
    tradeType,
    inputAmount,
    outputAmount,
    route: createRouteWithStableSwap({
      pairs,
      input: inputAmount.currency,
      output: outputAmount.currency,
    }),
  }
}
