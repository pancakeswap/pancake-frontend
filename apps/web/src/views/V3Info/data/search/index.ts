import { explorerApiClient } from 'state/info/api/client'
import { components } from 'state/info/api/schema'

export async function fetchSearchResults(
  chainName: components['schemas']['ChainName'],
  value: string,
  signal: AbortSignal,
): Promise<{
  tokens: { address: string; name: string; symbol: string; decimals: number; tvlUSD: number; priceUSD: number }[]
  pools: {
    token0: { address: string; name: string; symbol: string; decimals: number }
    token1: { address: string; name: string; symbol: string; decimals: number }
    feeTier: number
    address: string
    tvlUSD: number
  }[]
}> {
  try {
    const data = await explorerApiClient.GET('/cached/protocol/{protocol}/{chainName}/search', {
      signal,
      params: {
        path: {
          protocol: 'v3',
          chainName,
        },
        query: {
          text: value,
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
  } catch (e) {
    return {
      tokens: [],
      pools: [],
    }
  }
}
