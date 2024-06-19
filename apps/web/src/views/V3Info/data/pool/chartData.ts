import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { explorerApiClient } from 'state/info/api/client'
import type { components } from 'state/info/api/schema'
import { PoolChartEntry } from '../../types'

// format dayjs with the libraries that we need
dayjs.extend(utc)

export async function fetchPoolChartData(
  protocol: 'v2' | 'v3' | 'stable',
  chainName: components['schemas']['ChainName'],
  address: string,
  signal?: AbortSignal,
) {
  let error = false

  try {
    const rawFeeResults = await explorerApiClient
      .GET('/cached/pools/chart/v3/{chainName}/{address}/fees', {
        signal,
        params: {
          path: {
            chainName,
            address,
          },
        },
      })
      .then((res) => res.data)

    const rawTvlResults = await explorerApiClient
      .GET('/cached/pools/chart/{protocol}/{chainName}/{address}/tvl', {
        signal,
        params: {
          path: {
            protocol,
            chainName,
            address,
          },
          query: {
            period: '1Y',
          },
        },
      })
      .then((res) => res.data)

    const rawVolumeResults = await explorerApiClient
      .GET('/cached/pools/chart/{protocol}/{chainName}/{address}/volume', {
        signal,
        params: {
          path: {
            protocol,
            chainName,
            address,
          },
          query: {
            period: '1Y',
          },
        },
      })
      .then((res) => res.data)

    if (rawTvlResults || rawVolumeResults || rawFeeResults) {
      const volumeResults = rawVolumeResults?.reduce(
        (acc, item) => {
          const unixDate = dayjs(item.bucket as string).unix()
          // eslint-disable-next-line no-param-reassign
          acc[unixDate] = {
            volumeUSD: parseFloat(item.volumeUSD ?? '0'),
            date: unixDate,
          }
          return acc
        },
        {} as {
          [unixDate: number]: {
            volumeUSD: number
            date: number
          }
        },
      )

      const tvlResults = rawTvlResults?.reduce(
        (acc, item) => {
          const unixDate = dayjs(item.bucket as string).unix()
          // eslint-disable-next-line no-param-reassign
          acc[unixDate] = {
            totalValueLockedUSD: parseFloat(item.tvlUSD ?? '0'),
            date: unixDate,
          }
          return acc
        },
        {} as {
          [unixDate: number]: {
            totalValueLockedUSD: number
            date: number
          }
        },
      )

      const feeResults = rawFeeResults?.reduce(
        (acc, item) => {
          const unixDate = dayjs(item.bucket as string).unix()
          // eslint-disable-next-line no-param-reassign
          acc[unixDate] = {
            feesUSD: parseFloat(item.feeUSD ?? '0'),
            date: unixDate,
          }
          return acc
        },
        {} as {
          [unixDate: number]: {
            feesUSD: number
            date: number
          }
        },
      )

      const keys = [...new Set([...Object.keys(volumeResults ?? {}), ...Object.keys(tvlResults ?? {})])]

      const results = keys.reduce((acc, key) => {
        const volumeData = volumeResults?.[key] ?? { volumeUSD: 0, date: key }
        const tvlData = tvlResults?.[key] ?? { totalValueLockedUSD: 0, date: key }
        const feeData = feeResults?.[key] ?? { feesUSD: 0, date: key }

        // eslint-disable-next-line no-param-reassign
        acc[key] = { ...volumeData, ...tvlData, ...feeData }
        return acc
      }, {} as { [p: number]: PoolChartEntry })

      return {
        data: Object.values(results),
        error: false,
      }
    }
  } catch {
    error = true
  }

  return {
    data: undefined,
    error,
  }
}
