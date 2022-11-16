import { Currency, CurrencyAmount, ERC20Token, Pair, Token, TradeType } from '@pancakeswap/sdk'

import { RouteType } from './bestTrade'

export interface StableSwapPair {
  token0: ERC20Token
  token1: ERC20Token
  reserve0: CurrencyAmount<ERC20Token>
  reserve1: CurrencyAmount<ERC20Token>
  stableSwapAddress: string
  involvesToken: (token: ERC20Token) => boolean
}

export interface RouteWithStableSwap<TInput extends Currency, TOutput extends Currency> {
  routeType: RouteType
  pairs: (Pair | StableSwapPair)[]
  input: TInput
  output: TOutput
  path: Token[]
}

export interface TradeWithStableSwap<TInput extends Currency, TOutput extends Currency, TTradeType extends TradeType> {
  tradeType: TTradeType
  route: RouteWithStableSwap<TInput, TOutput>
  inputAmount: CurrencyAmount<TInput>
  outputAmount: CurrencyAmount<TOutput>
}
