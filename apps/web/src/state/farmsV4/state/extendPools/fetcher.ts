import { ChainId, getChainNameInKebabCase } from '@pancakeswap/chains'
import { Protocol } from '@pancakeswap/farms'
import { explorerApiClient } from 'state/info/api/client'
import { ChainIdAddressKey } from '../type'
import { parseFarmPools } from '../utils'

export enum PoolSortBy {
  APR = 'apr24h',
  TVL = 'tvlUSD',
  VOL = 'volumeUSD24h',
}

export type ExtendPoolsQuery = {
  protocols?: Protocol[]
  orderBy: PoolSortBy
  chains?: ChainId[]
  pools?: ChainIdAddressKey[]
  tokens?: ChainIdAddressKey[]
  before: string
  after: string
}
export const fetchExplorerPoolsList = async (query: Required<ExtendPoolsQuery>, signal?: AbortSignal) => {
  const resp = await explorerApiClient.GET('/cached/pools/list', {
    signal,
    params: {
      query: {
        chains: query.chains.map((chain) => getChainNameInKebabCase(chain)) as any[],
        protocols: query.protocols,
        orderBy: query.orderBy,
        pools: query.pools,
        tokens: query.tokens,
        before: query.before,
        after: query.after,
      },
    },
  })

  if (!resp.data) {
    return []
  }

  return parseFarmPools(resp.data.rows)
}
