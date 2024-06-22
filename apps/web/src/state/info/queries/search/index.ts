import { useQuery } from '@tanstack/react-query'
import { MINIMUM_SEARCH_CHARACTERS } from 'config/constants/info'
import { explorerApiClient } from 'state/info/api/client'
import { useExplorerChainNameByQuery } from 'state/info/api/hooks'
import { components } from 'state/info/api/schema'
import { checkIsStableSwap } from '../../constant'

async function search(
  chainName: components['schemas']['ChainName'],
  type: 'stableSwap' | 'swap',
  searchString: string,
  signal?: AbortSignal,
) {
  const data = await explorerApiClient.GET('/cached/protocol/{protocol}/{chainName}/search', {
    signal,
    params: {
      path: {
        chainName,
        protocol: type === 'stableSwap' ? 'stable' : 'v2',
      },
      query: {
        text: searchString,
      },
    },
  })

  return {
    tokens:
      data.data?.tokens.map((t) => ({
        address: t.id,
        name: t.name,
        symbol: t.symbol,
        decimals: t.decimals,
        priceUSD: +t.priceUSD,
        tvlUSD: +t.tvlUSD,
      })) ?? [],
    pools:
      data.data?.pools.map((p) => ({
        token0: {
          address: p.token0.id,
          name: p.token0.name,
          symbol: p.token0.symbol,
          decimals: p.token0.decimals,
        },
        token1: {
          address: p.token1.id,
          name: p.token1.name,
          symbol: p.token1.symbol,
          decimals: p.token1.decimals,
        },
        feeTier: p.feeTier,
        address: p.id,
        tvlUSD: +p.tvlUSD,
      })) ?? [],
  }
}

const useFetchSearchResults = (searchString: string, enabled = true) => {
  const searchStringTooShort = searchString.length < MINIMUM_SEARCH_CHARACTERS

  const chainName = useExplorerChainNameByQuery()

  const type = checkIsStableSwap() ? 'stableSwap' : 'swap'

  const {
    data: searchResults,
    isPending,
    isError,
  } = useQuery({
    queryFn: async ({ signal }) => {
      if (!chainName) {
        throw new Error('Chain name not found')
      }

      return search(chainName, type, searchString, signal)
    },
    queryKey: ['info-search', type, chainName],
    enabled: Boolean(chainName && !searchStringTooShort && enabled),
  })

  return {
    tokens: searchResults?.tokens ?? [],
    pools: searchResults?.pools ?? [],
    tokensLoading: isPending,
    poolsLoading: isPending,
    error: isError,
  }
}

export default useFetchSearchResults
