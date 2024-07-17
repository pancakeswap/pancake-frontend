import { ChainId, getChainNameInKebabCase } from '@pancakeswap/chains'
import { Protocol } from '@pancakeswap/farms'
import { atom } from 'jotai'
import { loadable } from 'jotai/utils'
import { explorerApiClient } from 'state/info/api/client'
import { ChainIdAddressKey, PoolInfo } from './type'
import { parseFarmPools } from './utils'

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

// export const extendPoolsQueryAtom = atom<ExtendPoolsQuery>({
//   protocols: undefined,
//   orderBy: PoolSortBy.VOL,
//   chains: undefined,
//   before: '',
//   after: '',
// })

export const extendPoolsAtom = atom(
  [] as PoolInfo[],
  async (get, set, query: ExtendPoolsQuery & { reset?: boolean }): Promise<PoolInfo[]> => {
    if (!query.chains || !query.protocols) {
      return []
    }

    const { reset, ...args } = query

    const data = await fetchExplorerPoolsList(args as Required<ExtendPoolsQuery>)

    if (reset) {
      return data
    }

    const currentData = get(extendPoolsAtom) ?? []
    return currentData.concat(data)
  },
)

export const asyncExtendPoolsAtom = loadable(extendPoolsAtom)

const fetchExplorerPoolsList = async (query: Required<ExtendPoolsQuery>, signal?: AbortSignal) => {
  const resp = await explorerApiClient.GET('/cached/pools/list', {
    signal,
    params: {
      query: {
        chains: query.chains.map((chain) => getChainNameInKebabCase(chain)) as any[],
        protocols: query.protocols,
        orderBy: query.orderBy,
        before: query.before,
        after: query.after,
        pools: query.pools,
        tokens: query.tokens,
      },
    },
  })

  if (!resp.data) {
    return []
  }

  return parseFarmPools(resp.data.rows)
}
