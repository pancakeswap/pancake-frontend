import { explorerApiClient } from 'state/info/api/client'
import { components } from 'state/info/api/schema'
import { PoolData } from 'views/V3Info/types'

/**
 * Fetch top addresses by volume
 */
export async function fetchPoolsForToken(
  address: string,
  chainName: components['schemas']['ChainName'],
): Promise<{
  error: boolean
  data: PoolData[]
}> {
  try {
    const data = await explorerApiClient.GET('/cached/pools/v3/{chainName}/list/top', {
      params: {
        path: {
          chainName,
        },
        query: {
          token: address,
        },
      },
    })

    return {
      data:
        data.data?.map((item) => ({
          ...item,
          address: item.id,
          volumeUSD: parseFloat(item.volumeUSD24h),
          volumeUSDWeek: parseFloat(item.volumeUSD7d),
          token0: { ...item.token0, address: item.token0.id, derivedETH: 0 },
          token1: { ...item.token1, address: item.token1.id, derivedETH: 0 },
          feeUSD: item.totalFeeUSD,
          liquidity: parseFloat(item.liquidity),
          sqrtPrice: parseFloat(item.sqrtPrice),
          tick: item.tick ?? 0,
          tvlUSD: parseFloat(item.tvlUSD),
          token0Price: parseFloat(item.token0Price),
          token1Price: parseFloat(item.token1Price),
          tvlToken0: parseFloat(item.tvlToken0),
          tvlToken1: parseFloat(item.tvlToken1),
          volumeUSDChange: 0,
          tvlUSDChange: 0,
        })) ?? [],
      error: false,
    }
  } catch {
    return {
      error: true,
      data: [],
    }
  }
}
