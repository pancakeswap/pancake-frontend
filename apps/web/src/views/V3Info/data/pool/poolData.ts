import { components } from 'state/info/api/schema'
import { explorerApiClient } from 'state/info/api/client'
import { getPercentChange } from 'utils/infoDataHelpers'
import { PoolData } from '../../types'

export async function fetchedPoolData(
  chainName: components['schemas']['ChainName'],
  poolAddress: string,
  signal: AbortSignal,
): Promise<{
  error: boolean
  data: PoolData | undefined
}> {
  try {
    const data = await explorerApiClient
      .GET('/cached/pools/v3/{chainName}/{address}', {
        signal,
        params: {
          path: {
            chainName,
            address: poolAddress,
          },
        },
      })
      .then((res) => res.data)

    if (!data) {
      return {
        error: false,
        data: undefined,
      }
    }

    const volumeUSD = data.volumeUSD24h ? parseFloat(data.volumeUSD24h) : 0

    const volumeOneWindowAgo =
      data.volumeUSD24h && data.volumeUSD48h ? parseFloat(data.volumeUSD48h) - parseFloat(data.volumeUSD24h) : undefined

    const volumeUSDChange = volumeUSD && volumeOneWindowAgo ? getPercentChange(volumeUSD, volumeOneWindowAgo) : 0

    const volumeUSDWeek = data.volumeUSD7d ? parseFloat(data.volumeUSD7d) : 0

    const tvlUSD = data.tvlUSD ? parseFloat(data.tvlUSD) : 0
    const tvlUSDChange = getPercentChange(
      data.tvlUSD ? parseFloat(data.tvlUSD) : undefined,
      data.tvlUSD24h ? parseFloat(data.tvlUSD24h) : undefined,
    )

    const feeUSD = parseFloat(data.feeUSD24h) ?? 0

    return {
      error: false,
      data: {
        address: data.id,
        feeTier: data.feeTier,
        liquidity: parseFloat(data.liquidity),
        sqrtPrice: parseFloat(data.sqrtPrice),
        tick: data.tick ?? 0,
        token0: {
          address: data.token0.id,
          name: data.token0.name,
          symbol: data.token0.symbol,
          decimals: data.token0.decimals,
          derivedETH: 0,
        },
        token1: {
          address: data.token1.id,
          name: data.token1.name,
          symbol: data.token1.symbol,
          decimals: data.token1.decimals,
          derivedETH: 0,
        },
        token0Price: parseFloat(data.token0Price),
        token1Price: parseFloat(data.token1Price),
        volumeUSD,
        volumeUSDChange,
        volumeUSDWeek,
        tvlUSD,
        tvlUSDChange,
        tvlToken0: parseFloat(data.tvlToken0),
        tvlToken1: parseFloat(data.tvlToken1),
        feeUSD,
      },
    }
  } catch (e) {
    return {
      error: true,
      data: undefined,
    }
  }
}
