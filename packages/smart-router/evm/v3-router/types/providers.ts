import { Currency } from '@pancakeswap/sdk'

import { Pool, PoolType } from './pool'
import { RouteWithoutQuote, Route } from './route'

export interface PoolProvider {
  getCandidatePools: (currencyA: Currency, currencyB: Currency) => Promise<Pool[]>

  getPools: (tokenGroups: Currency[][]) => Promise<Pool[]>

  getPool: (currencyA: Currency, currencyB: Currency, type: PoolType) => Promise<Pool | null>
}

export interface QuoteProvider {
  getRouteWithQuotesExactIn: (routes: RouteWithoutQuote[]) => Promise<Route[]>
  getRouteWithQuotesExactOut: (routes: RouteWithoutQuote[]) => Promise<Route[]>
}
