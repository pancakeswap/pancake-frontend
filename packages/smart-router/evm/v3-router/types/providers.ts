import { Currency, BigintIsh, ChainId } from '@pancakeswap/sdk'
import { Provider as IProvider } from '@ethersproject/providers'

import { Pool, PoolType } from './pool'
import { RouteWithoutQuote, Route } from './route'

export interface PoolProvider {
  getCandidatePools: (currencyA: Currency, currencyB: Currency, blockNumber: BigintIsh) => Promise<Pool[]>

  getPools: (pairs: [Currency, Currency][], blockNumber: BigintIsh) => Promise<Pool[]>

  getPool: (currencyA: Currency, currencyB: Currency, type: PoolType, blockNumber: BigintIsh) => Promise<Pool | null>
}

export interface QuoteProvider {
  getRouteWithQuotesExactIn: (routes: RouteWithoutQuote[]) => Promise<Route[]>
  getRouteWithQuotesExactOut: (routes: RouteWithoutQuote[]) => Promise<Route[]>
}

export type OnChainProvider = ({ chainId }: { chainId?: ChainId }) => IProvider
