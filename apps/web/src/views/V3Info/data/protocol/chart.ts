import dayjs from 'dayjs'
import { explorerApiClient } from 'state/info/api/client'
import type { components } from 'state/info/api/schema'
import { ChartDataTimeWindowEnum } from '@pancakeswap/uikit'
import { timeWindowToPeriod } from 'utils/timeWindowToPeriod'
import { ChartDayData } from '../../types'

export async function fetchChartData(
  protocol: 'v2' | 'v3' | 'stable',
  chainName: components['schemas']['ChainName'],
  timeWindow: Exclude<ChartDataTimeWindowEnum, ChartDataTimeWindowEnum.HOUR> &
    Exclude<ChartDataTimeWindowEnum, ChartDataTimeWindowEnum.YEAR>,
  signal: AbortSignal,
) {
  let error = false

  try {
    const rawTvlResults = await explorerApiClient
      .GET('/cached/protocol/chart/{protocol}/{chainName}/tvl', {
        signal,
        params: {
          path: {
            protocol,
            chainName,
          },
          query: {
            groupBy: timeWindowToPeriod(timeWindow) as '1D' | '1W' | '1M',
          },
        },
      })
      .then((res) => res.data)

    const rawVolumeResults = await explorerApiClient
      .GET('/cached/protocol/chart/{protocol}/{chainName}/volume', {
        signal,
        params: {
          path: {
            protocol,
            chainName,
          },
          query: {
            groupBy: timeWindowToPeriod(timeWindow) as '1D' | '1W' | '1M',
          },
        },
      })
      .then((res) => res.data)

    if (rawTvlResults || rawVolumeResults) {
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
            tvlUSD: parseFloat(item.tvlUSD ?? '0'),
            date: unixDate,
          }
          return acc
        },
        {} as {
          [unixDate: number]: {
            tvlUSD: number
            date: number
          }
        },
      )

      const keys = [...new Set([...Object.keys(volumeResults ?? {}), ...Object.keys(tvlResults ?? {})])]

      const results = keys.reduce((acc, key) => {
        const volumeData = volumeResults?.[key] ?? { volumeUSD: 0, date: key }
        const tvlData = tvlResults?.[key] ?? { tvlUSD: 0, date: key }

        // eslint-disable-next-line no-param-reassign
        acc[key] = { ...volumeData, ...tvlData }
        return acc
      }, {} as { [p: number]: ChartDayData })

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
