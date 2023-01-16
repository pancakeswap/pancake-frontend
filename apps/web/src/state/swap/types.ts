import { Currency, TradeType } from '@pancakeswap/sdk'
// import { Currency, CurrencyAmount, Token, TradeType, Route as V2Route } from '@pancakeswap/sdk'
// import { Route as V3Route } from '@pancakeswap/v3-sdk'
// import { MixedRouteSDK, Trade } from '@pancakeswap/router-sdk'

export type PairDataNormalized = {
  time: number
  token0Id: string
  token1Id: string
  reserve0: number
  reserve1: number
}[]

export type DerivedPairDataNormalized = {
  time: number
  token0Id: string
  token1Id: string
  token0DerivedBNB: number
  token1DerivedBNB: number
}[]

export type PairPricesNormalized = {
  time: Date
  value: number
}[]

export enum PairDataTimeWindowEnum {
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export enum TradeState {
  INVALID,
  LOADING,
  NO_ROUTE_FOUND,
  SYNCING,
  VALID,
}

export class InterfaceTrade<
  TInput extends Currency,
  TOutput extends Currency,
  TTradeType extends TradeType,
> extends Trade<TInput, TOutput, TTradeType> {
  // gasUseEstimateUSD: CurrencyAmount<Token> | null | undefined
  // blockNumber: string | null | undefined
  // constructor({
  //   gasUseEstimateUSD,
  //   blockNumber,
  //   ...routes
  // }: {
  //   gasUseEstimateUSD?: CurrencyAmount<Token> | undefined | null
  //   blockNumber?: string | null | undefined
  //   v2Routes: {
  //     routev2: V2Route<TInput, TOutput>
  //     inputAmount: CurrencyAmount<TInput>
  //     outputAmount: CurrencyAmount<TOutput>
  //   }[]
  //   v3Routes: {
  //     routev3: V3Route<TInput, TOutput>
  //     inputAmount: CurrencyAmount<TInput>
  //     outputAmount: CurrencyAmount<TOutput>
  //   }[]
  //   tradeType: TTradeType
  //   mixedRoutes?: {
  //     mixedRoute: MixedRouteSDK<TInput, TOutput>
  //     inputAmount: CurrencyAmount<TInput>
  //     outputAmount: CurrencyAmount<TOutput>
  //   }[]
  // }) {
  //   super(routes)
  //   this.blockNumber = blockNumber
  //   this.gasUseEstimateUSD = gasUseEstimateUSD
  // }
}
