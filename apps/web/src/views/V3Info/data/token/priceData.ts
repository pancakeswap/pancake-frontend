import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { explorerApiClient } from 'state/info/api/client'
import { components } from 'state/info/api/schema'
import { PriceChartEntry } from '../../types'

// format dayjs with the libraries that we need
dayjs.extend(utc)

export async function fetchTokenPriceData(
  address: string,
  protocol: 'v2' | 'v3' | 'stable',
  duration: 'day' | 'week' | 'month' | 'year',
  chainName: components['schemas']['ChainName'],
  signal: AbortSignal,
): Promise<{ data: PriceChartEntry[]; error: boolean }> {
  try {
    const data = await explorerApiClient
      .GET('/cached/tokens/chart/{chainName}/{address}/{protocol}/price', {
        signal,
        params: {
          path: {
            protocol,
            chainName,
            address,
          },
          query: {
            period:
              duration === 'day'
                ? '1D'
                : duration === 'week'
                ? '1W'
                : duration === 'month'
                ? '1M'
                : duration === 'year'
                ? '1Y'
                : '1D',
          },
        },
      })
      .then((res) => res.data)

    if (!data) {
      return {
        data: [],
        error: false,
      }
    }

    const formattedHistory = data.map((d) => {
      return {
        time: dayjs(d.bucket as string).unix(),
        open: parseFloat(d.open ?? ''),
        close: parseFloat(d.close ?? ''),
        high: parseFloat(d.high ?? ''),
        low: parseFloat(d.low ?? ''),
      }
    })

    return {
      data: formattedHistory,
      error: false,
    }
  } catch (e) {
    console.error(e)
    return {
      data: [],
      error: true,
    }
  }
}

export async function fetchPairPriceChartTokenData(
  address: string,
  chainName: components['schemas']['ChainName'],
  duration: 'hour' | 'day' | 'week' | 'month' | 'year',
  signal: AbortSignal,
): Promise<{
  data: PriceChartEntry[]
  maxPrice?: number
  minPrice?: number
  averagePrice?: number
  error: boolean
}> {
  // start and end bounds
  let averagePrice = 0
  let minPrice = 0
  let maxPrice = 0
  try {
    const data = await explorerApiClient
      .GET('/cached/pools/chart/v3/{chainName}/{address}/rate', {
        signal,
        params: {
          path: {
            chainName,
            address,
          },
          query: {
            period:
              duration === 'hour'
                ? '1H'
                : duration === 'day'
                ? '1D'
                : duration === 'week'
                ? '1W'
                : duration === 'month'
                ? '1M'
                : duration === 'year'
                ? '1Y'
                : '1D',
          },
        },
      })
      .then((res) => res.data)

    if (!data) {
      return {
        data: [],
        error: false,
      }
    }

    const formattedHistory = data.map((d) => {
      const high = parseFloat(d.high ?? '0')
      const low = parseFloat(d.low ?? '0')
      const close = parseFloat(d.close ?? '0')
      averagePrice += close
      if (minPrice === 0 || low < minPrice) {
        minPrice = low
      }
      if (maxPrice === 0 || high > maxPrice) {
        maxPrice = high
      }
      return {
        time: dayjs(d.bucket as string).unix(),
        open: parseFloat(d.open ?? '0'),
        close,
        high,
        low,
      }
    })
    averagePrice /= formattedHistory.length
    return {
      data: formattedHistory,
      maxPrice,
      minPrice,
      averagePrice,
      error: false,
    }
  } catch (e) {
    console.error(e)
    return {
      data: [],
      error: true,
    }
  }
}
