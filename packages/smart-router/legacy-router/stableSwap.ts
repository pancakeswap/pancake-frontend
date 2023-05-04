import { Currency, CurrencyAmount, Pair, Percent, Price, Trade, TradeType, ERC20Token } from '@pancakeswap/sdk'
import invariant from 'tiny-invariant'
import { Address } from 'viem'

import { RouteType, RouteWithStableSwap, StableSwapFeeRaw, StableSwapPair, StableSwapFeePercent } from './types'
import { BasePair } from './types/pair'
import { getOutputToken } from './utils/pair'

export function createStableSwapPair(
  pair: Omit<BasePair, 'involvesToken'>,
  stableSwapAddress: Address = '0x',
  lpAddress: Address = '0x',
  infoStableSwapAddress: Address = '0x',
  stableLpFee = 0,
  stableLpFeeRateOfTotalFee = 0,
): StableSwapPair {
  return {
    ...pair,
    stableSwapAddress,
    lpAddress,
    infoStableSwapAddress,
    liquidityToken: new ERC20Token(pair.token0.chainId, lpAddress, 18, 'Stable-LP', 'Pancake StableSwap LPs'),
    // default price & fees are zero, need to get the actual price from chain
    price: new Price(pair.token0, pair.token1, '0', '1'),
    fee: new Percent(0),
    adminFee: new Percent(0),
    involvesToken: (token) => token.equals(pair.token0) || token.equals(pair.token1),
    stableLpFee,
    stableLpFeeRateOfTotalFee,
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

  const path: Currency[] = [wrappedInput]
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

export function getFeePercent(
  inputAmount: CurrencyAmount<Currency>,
  outputAmount: CurrencyAmount<Currency>,
  { fee, adminFee }: StableSwapFeeRaw,
): StableSwapFeePercent {
  invariant(fee.currency.equals(outputAmount.currency), 'FEE_CURRENCY_MATCH')
  invariant(adminFee.currency.equals(outputAmount.currency), 'FEE_CURRENCY_MATCH')

  const priceWithoutFee = new Price({ baseAmount: outputAmount.add(fee), quoteAmount: inputAmount })
  const inputFee = priceWithoutFee.quote(fee)
  const inputAdminFee = priceWithoutFee.quote(adminFee)
  return {
    fee: new Percent(inputFee.quotient, inputAmount.quotient),
    adminFee: new Percent(inputAdminFee.quotient, inputAmount.quotient),
  }
}
