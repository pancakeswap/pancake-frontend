import { Currency, BigintIsh, ChainId } from '@pancakeswap/sdk'
import { Provider as IProvider } from '@ethersproject/providers'
import type { GraphQLClient } from 'graphql-request'

import { Pool } from './pool'
import { RouteWithoutQuote, RouteWithQuote } from './route'
import { GasModel } from './gasModel'

export interface PoolProvider {
  getCandidatePools: (currencyA: Currency, currencyB: Currency, blockNumber: BigintIsh) => Promise<Pool[]>

  getPools: (pairs: [Currency, Currency][], blockNumber: BigintIsh) => Promise<Pool[]>
}

export interface QuoterOptions {
  blockNumber: BigintIsh
  gasModel: GasModel
}

export interface QuoteProvider {
  getRouteWithQuotesExactIn: (routes: RouteWithoutQuote[], options: QuoterOptions) => Promise<RouteWithQuote[]>
  getRouteWithQuotesExactOut: (routes: RouteWithoutQuote[], options: QuoterOptions) => Promise<RouteWithQuote[]>
}

export type OnChainProvider = ({ chainId }: { chainId?: ChainId }) => IProvider

export type SubgraphProvider = ({ chainId }: { chainId?: ChainId }) => GraphQLClient
