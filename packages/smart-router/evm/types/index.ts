import { Currency, Pair, Route, Trade, TradeType } from '@pancakeswap/sdk'

export * from './chain'

export interface StableSwapPair extends Pair {
  stableSwapAddress: string
}

export interface RouteWithStableSwap<TInput extends Currency, TOutput extends Currency> extends Route<TInput, TOutput> {
  pairs: (Pair | StableSwapPair)[]
}

export interface TradeWithStableSwap<TInput extends Currency, TOutput extends Currency, TTradeType extends TradeType>
  extends Trade<TInput, TOutput, TTradeType> {
  route: RouteWithStableSwap<TInput, TOutput>
}
