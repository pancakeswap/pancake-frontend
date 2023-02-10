import { Currency, CurrencyAmount, JSBI } from '@pancakeswap/sdk'

import { Pool } from './pool'

export enum RouteType {
  V2,
  V3,
  STABLE,
  MIXED,
}

export interface BaseRoute {
  // Support all v2, v3, stable, and combined
  // Can derive from pools
  type: RouteType

  // Pools that swap will go through
  pools: Pool[]

  path: Currency[]

  input: Currency

  output: Currency
}

export type RouteEssentials = Omit<BaseRoute, 'input' | 'output'>

export interface RouteWithoutQuote extends BaseRoute {
  percent: number
  amount: CurrencyAmount<Currency>
}

export interface Route extends RouteEssentials {
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
}

export interface RouteQuote {
  // If exact in, this is (quote - gasCostInToken). If exact out, this is (quote + gasCostInToken).
  quoteAdjustedForGas: CurrencyAmount<Currency>
  quote: CurrencyAmount<Currency>
  gasEstimate: JSBI
  // The gas cost in terms of the quote token.
  gasCostInToken: CurrencyAmount<Currency>
  gasCostInUSD: CurrencyAmount<Currency>
}

export type RouteWithQuote = RouteWithoutQuote & RouteQuote
