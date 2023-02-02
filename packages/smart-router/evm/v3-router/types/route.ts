import { Currency, CurrencyAmount } from '@pancakeswap/sdk'

import { Pool } from './pool'

export enum RouteType {
  V2,
  V3,
  STABLE,
  MIXED,
}

export interface Route {
  // Support all v2, v3, stable, and combined
  // Can derive from pools
  type: RouteType

  // Pools that swap will go through
  pools: Pool[]

  path: Currency[]
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
}
