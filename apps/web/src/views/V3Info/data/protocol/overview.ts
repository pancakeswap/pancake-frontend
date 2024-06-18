import BigNumber from 'bignumber.js'
import type { components } from 'state/info/api/schema'
import { explorerApiClient } from 'state/info/api/client'
import { getPercentChange } from '../../utils/data'
import { ProtocolData } from '../../types'

export async function fetchProtocolData(
  chainName: components['schemas']['ChainName'],
  signal: AbortSignal,
): Promise<{
  error: boolean
  data: ProtocolData | undefined
}> {
  try {
    const data = await explorerApiClient
      .GET('/cached/protocol/{protocol}/{chainName}/stats', {
        signal,
        params: {
          path: {
            chainName,
            protocol: 'v3',
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

    // volume data
    const volumeUSD = data.volumeUSD24h ? parseFloat(data.volumeUSD24h) : 0

    const volumeOneWindowAgo =
      data.volumeUSD24h && data.volumeUSD48h ? parseFloat(data.volumeUSD48h) - parseFloat(data.volumeUSD24h) : undefined

    const volumeUSDChange =
      volumeUSD && volumeOneWindowAgo
        ? getPercentChange(volumeUSD.toString(), volumeOneWindowAgo.toString())
        : undefined

    // total value locked
    const tvlUSDChange = getPercentChange(data.tvlUSD, data.tvlUSD24h)

    // 24H transactions
    const txCount = data.txCount24h

    const txCountOneWindowAgo = data.txCount24h && data.txCount48h ? data.txCount48h - data.txCount24h : undefined

    const txCountChange =
      txCount && txCountOneWindowAgo ? getPercentChange(txCount.toString(), txCountOneWindowAgo.toString()) : 0

    const feesOneWindowAgo =
      data.totalFeeUSD48h && data.totalProtocolFeeUSD48h && data.totalFeeUSD24h && data.totalProtocolFeeUSD24h
        ? new BigNumber(data.totalFeeUSD24h)
            .minus(data.totalProtocolFeeUSD24h)
            .minus(new BigNumber(data.totalFeeUSD48h).minus(data.totalProtocolFeeUSD48h))
        : undefined

    const feesUSD =
      data.totalFeeUSD && data.totalProtocolFeeUSD && data.totalFeeUSD24h && data.totalProtocolFeeUSD24h
        ? new BigNumber(data.totalFeeUSD)
            .minus(data.totalProtocolFeeUSD)
            .minus(new BigNumber(data.totalFeeUSD24h).minus(data.totalProtocolFeeUSD24h))
        : new BigNumber(data.totalFeeUSD).minus(data.totalProtocolFeeUSD)

    const feeChange =
      feesUSD && feesOneWindowAgo ? getPercentChange(feesUSD.toString(), feesOneWindowAgo.toString()) : 0

    const formattedData = {
      volumeUSD,
      volumeUSDChange: typeof volumeUSDChange === 'number' ? volumeUSDChange : 0,
      tvlUSD: parseFloat(data.tvlUSD),
      tvlUSDChange,
      feesUSD: feesUSD.toNumber(),
      feeChange,
      txCount,
      txCountChange,
    }

    return {
      error: false,
      data: formattedData,
    }
  } catch (e) {
    console.error(e)
    return {
      error: false,
      data: undefined,
    }
  }
}
