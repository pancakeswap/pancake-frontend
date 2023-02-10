import { Currency, BigintIsh, ChainId } from '@pancakeswap/sdk'
import { Provider as IProvider } from '@ethersproject/providers'
import type { GraphQLClient } from 'graphql-request'

import { Pool, PoolType } from './pool'
import { RouteWithoutQuote, RouteWithQuote } from './route'

export interface PoolProvider {
  getCandidatePools: (currencyA: Currency, currencyB: Currency, blockNumber: BigintIsh) => Promise<Pool[]>

  getPools: (pairs: [Currency, Currency][], blockNumber: BigintIsh) => Promise<Pool[]>

  getPool: (currencyA: Currency, currencyB: Currency, type: PoolType, blockNumber: BigintIsh) => Promise<Pool | null>
}

export interface QuoteProvider {
  getRouteWithQuotesExactIn: (routes: RouteWithoutQuote[]) => Promise<RouteWithQuote[]>
  getRouteWithQuotesExactOut: (routes: RouteWithoutQuote[]) => Promise<RouteWithQuote[]>
}

export type OnChainProvider = ({ chainId }: { chainId?: ChainId }) => IProvider

export type SubgraphProvider = ({ chainId }: { chainId?: ChainId }) => GraphQLClient
