import { Currency, BigintIsh, ChainId } from '@pancakeswap/sdk'
import { PublicClient } from 'viem'
import type { GraphQLClient } from 'graphql-request'

import { Pool, PoolType } from './pool'
import { RouteWithoutQuote, RouteWithQuote } from './route'
import { GasModel } from './gasModel'
import { BatchMulticallConfigs, ChainMap } from '../../types'

interface GetPoolParams {
  currencyA?: Currency
  currencyB?: Currency
  blockNumber?: BigintIsh
  protocols?: PoolType[]

  // Only use this param if we want to specify pairs we want to get
  pairs?: [Currency, Currency][]
}

export interface PoolProvider {
  getCandidatePools: (params: GetPoolParams) => Promise<Pool[]>
}

export interface QuoterOptions {
  blockNumber?: BigintIsh
  gasModel: GasModel
}

export type QuoterConfig = {
  onChainProvider: OnChainProvider
  gasLimit?: BigintIsh
  multicallConfigs?: ChainMap<BatchMulticallConfigs>
}

export interface QuoteProvider<C = any> {
  getRouteWithQuotesExactIn: (routes: RouteWithoutQuote[], options: QuoterOptions) => Promise<RouteWithQuote[]>
  getRouteWithQuotesExactOut: (routes: RouteWithoutQuote[], options: QuoterOptions) => Promise<RouteWithQuote[]>

  getConfig?: () => C
}

export type OnChainProvider = ({ chainId }: { chainId?: ChainId }) => PublicClient

export type SubgraphProvider = ({ chainId }: { chainId?: ChainId }) => GraphQLClient
