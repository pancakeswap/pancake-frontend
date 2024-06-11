import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { gql, GraphQLClient } from 'graphql-request'
import { MultiChainNameExtend } from 'state/info/constant'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { explorerApiClient } from 'state/info/api/client'
import { components } from 'state/info/api/schema'
import { ONE_DAY_SECONDS } from '../../constants'
import { PriceChartEntry } from '../../types'

// format dayjs with the libraries that we need
dayjs.extend(utc)

const DAY_PAIR_PRICE_CHART = (timestamps: number[] | string[]) => {
  let queryString = 'query poolHourDatas($address: String) {'
  timestamps.forEach((d) => {
    queryString += `
      t${d}:poolDayDatas(
        first: 1
        skip: 0
        where: { pool: $address, date_gte: ${d} }
        orderBy: date
        orderDirection: asc
      ) {
        date
        high
        low
        open
        close
      }
    `
  })
  queryString += '}'
  return gql`
    ${queryString}
  `
}

const DAY_PAIR_MAX = (timestamp: number | string) => {
  const queryString = `query maxPrice($address: String) {
      poolDayDatas(
        first: 1
        skip: 0
        where: { pool: $address, date_gte: ${timestamp} }
        orderBy: high
        orderDirection: desc
      ) {
        high
      }
  }`
  return gql`
    ${queryString}
  `
}

const DAY_PAIR_MIN = (timestamp: number | string) => {
  const queryString = `query minPrice($address: String) {
     poolDayDatas(
        first: 1
        skip: 0
        where: { pool: $address, date_gte: ${timestamp},low_gt: 0 }
        orderBy: low
        orderDirection: asc
      ) {
        low
      }
  }`
  return gql`
    ${queryString}
  `
}

const HOUR_PAIR_PRICE_CHART = (timestamps: number[] | string[]) => {
  let queryString = 'query poolHourDatas($address: String) {'
  timestamps.forEach((d) => {
    queryString += `
      t${d}:poolHourDatas(
        first: 1
        skip: 0
        where: { pool: $address, periodStartUnix: ${d} }
        orderBy: periodStartUnix
        orderDirection: asc
      ) {
        periodStartUnix
        high
        low
        open
        close
      }
    `
  })
  queryString += '}'
  return gql`
    ${queryString}
  `
}

const HOUR_PRICE_MIN = (timestamp: number | string) => gql`
  query minPrice( $address: String!) {
    poolHourDatas(
      first: 1
      where: { pool: $address, periodStartUnix: ${timestamp}, low_gt: 0 }
      orderBy: low
      orderDirection: asc
    ) {
      low
    }
  }
`

const HOUR_PRICE_MAX = (timestamp: number | string) => gql`
  query maxPrice( $address: String!) {
    poolHourDatas(
      first: 1
      where: { pool: $address, periodStartUnix: ${timestamp} }
      orderBy: high
      orderDirection: desc
    ) {
      high
    }
  }
`

interface TokenHourDatas {
  periodStartUnix: number
  high: string
  low: string
  open: string
  close: string
}

type PriceResultsForPairPriceChartResult = Record<string, TokenHourDatas[]>
type PairPriceMinMAxResults = Record<string, TokenHourDatas>

export async function fetchTokenPriceData(
  address: string,
  protocol: 'v2' | 'v3' | 'stable',
  duration: 'day' | 'week' | 'month' | 'year',
  chainName: components['schemas']['ChainName'],
): Promise<{
  data: PriceChartEntry[]
  error: boolean
}> {
  try {
    const data = await explorerApiClient
      .GET('/cached/tokens/chart/{chainName}/{address}/{protocol}/price', {
        signal: null,
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
  interval: number,
  startTimestamp: number,
  dataClient: GraphQLClient,
  chainName: MultiChainNameExtend,
  subgraphStartBlock: number,
): Promise<{
  data: PriceChartEntry[]
  maxPrice?: number
  minPrice?: number
  averagePrice?: number
  error: boolean
}> {
  const isDay = interval === ONE_DAY_SECONDS
  // start and end bounds
  let averagePrice = 0
  try {
    const endTimestamp = dayjs.utc().unix()

    if (!startTimestamp) {
      console.error('Error constructing price start timestamp')
      return {
        data: [],
        error: false,
      }
    }

    // create an array of hour start times until we reach current hour
    const timestamps: number[] = []
    let time = startTimestamp
    while (time <= endTimestamp) {
      timestamps.push(time)
      time += interval
    }

    // backout if invalid timestamp format
    if (timestamps.length === 0) {
      return {
        data: [],
        error: false,
      }
    }

    // fetch blocks based on timestamp
    const blocks = (await getBlocksFromTimestamps(timestamps, 'asc', 500, chainName)).filter(
      (d) => d.number >= subgraphStartBlock,
    )

    if (!blocks || blocks.length === 0) {
      console.error('Error fetching blocks')
      return {
        data: [],
        error: false,
      }
    }

    let data: {
      periodStartUnix?: number
      date?: number
      high: string
      low: string
      open: string
      close: string
    }[] = []

    // eslint-disable-next-line no-await-in-loop
    const priceData = await dataClient.request<PriceResultsForPairPriceChartResult>(
      isDay
        ? DAY_PAIR_PRICE_CHART(blocks.map((d) => d.timestamp))
        : HOUR_PAIR_PRICE_CHART(blocks.map((d) => d.timestamp)),
      {
        address,
      },
    )

    const maxQueryPrice = isDay
      ? (
          await dataClient.request<PairPriceMinMAxResults>(DAY_PAIR_MAX(blocks?.[0].timestamp), {
            address,
          })
        )?.poolDayDatas?.[0]?.high
      : (
          await dataClient.request<PairPriceMinMAxResults>(HOUR_PRICE_MAX(blocks?.[0].timestamp), {
            address,
          })
        )?.poolHourDatas?.[0]?.high
    const minQueryPrice = isDay
      ? (
          await dataClient.request<PairPriceMinMAxResults>(DAY_PAIR_MIN(blocks?.[0].timestamp), {
            address,
          })
        )?.poolDayDatas?.[0]?.low
      : (
          await dataClient.request<PairPriceMinMAxResults>(HOUR_PRICE_MIN(blocks?.[0].timestamp), {
            address,
          })
        )?.poolHourDatas?.[0]?.low

    if (Object.keys(priceData)?.length > 0) {
      if (priceData) {
        Object.values(priceData).forEach((d) => {
          data = data.concat(d)
        })
      }
    }

    const formattedHistory = data.map((d) => {
      const high = parseFloat(d.high)
      const low = parseFloat(d.low)
      const close = parseFloat(d.close)
      averagePrice += close
      return {
        time: (d?.periodStartUnix || d?.date)!,
        open: parseFloat(d.open),
        close,
        high,
        low,
      }
    })
    averagePrice /= formattedHistory.length
    return {
      data: formattedHistory,
      maxPrice: parseFloat(maxQueryPrice),
      minPrice: parseFloat(minQueryPrice),
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
