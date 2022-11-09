import { Currency, CurrencyAmount, Pair, Route, TradeType } from '@pancakeswap/sdk'

export interface StableSwapPair extends Pair {
  stableSwapAddress: string
}

export interface RouteWithStableSwap<TInput extends Currency, TOutput extends Currency> extends Route<TInput, TOutput> {
  pairs: (Pair | StableSwapPair)[]
}

export interface TradeWithStableSwap<TInput extends Currency, TOutput extends Currency, TTradeType extends TradeType> {
  tradeType: TTradeType
  route: RouteWithStableSwap<TInput, TOutput>
  inputAmount: CurrencyAmount<TInput>
  outputAmount: CurrencyAmount<TOutput>
}
