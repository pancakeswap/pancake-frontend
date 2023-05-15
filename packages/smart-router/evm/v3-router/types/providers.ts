import { Currency, BigintIsh, ChainId } from '@pancakeswap/sdk'
import { PublicClient } from 'viem'
import type { GraphQLClient } from 'graphql-request'

import { Pool, PoolType } from './pool'
import { RouteWithoutQuote, RouteWithQuote } from './route'
import { GasModel } from './gasModel'

interface PoolOptions {
  blockNumber?: BigintIsh
  protocols?: PoolType[]
}

export interface PoolProvider {
  getCandidatePools: (currencyA: Currency, currencyB: Currency, options: PoolOptions) => Promise<Pool[]>

  getPools: (pairs: [Currency, Currency][], options: PoolOptions) => Promise<Pool[]>
}

export interface QuoterOptions {
  blockNumber?: BigintIsh
  gasModel: GasModel
}

export interface QuoteProvider {
  getRouteWithQuotesExactIn: (routes: RouteWithoutQuote[], options: QuoterOptions) => Promise<RouteWithQuote[]>
  getRouteWithQuotesExactOut: (routes: RouteWithoutQuote[], options: QuoterOptions) => Promise<RouteWithQuote[]>
}

export type OnChainProvider = ({ chainId }: { chainId?: ChainId }) => PublicClient

export type SubgraphProvider = ({ chainId }: { chainId?: ChainId }) => GraphQLClient
