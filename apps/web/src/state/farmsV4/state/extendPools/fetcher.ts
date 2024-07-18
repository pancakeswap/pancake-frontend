import { getChainNameInKebabCase } from '@pancakeswap/chains'
import { explorerApiClient } from 'state/info/api/client'
import { parseFarmPools } from '../utils'
import { ExtendPoolsQuery } from './atom'

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
    return {
      pools: [],
      endCursor: '',
      startCursor: '',
      hasNextPage: false,
      hasPrevPage: false,
    }
  }

  const { rows, endCursor, startCursor, hasNextPage, hasPrevPage } = resp.data

  return {
    pools: parseFarmPools(rows),
    endCursor,
    startCursor,
    hasNextPage,
    hasPrevPage,
  }
}
