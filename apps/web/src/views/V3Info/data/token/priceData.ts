import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { gql, GraphQLClient } from 'graphql-request'
import { MultiChainNameExtend } from 'state/info/constant'
import { getBlocksFromTimestamps } from 'utils/getBlocksFromTimestamps'
import { PriceChartEntry } from '../../types'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)

export const PRICES_BY_BLOCK = (tokenAddress: string, blocks: any) => {
  let queryString = 'query blocks {'
  queryString += blocks.map(
    (block: any) => `
      t${block.timestamp}:token(id:"${tokenAddress}", block: { number: ${block.number} }) {
        derivedETH
      }
    `,
  )
  queryString += ','
  queryString += blocks.map(
    (block: any) => `
      b${block.timestamp}: bundle(id:"1", block: { number: ${block.number} }) {
        ethPriceUSD
      }
    `,
  )

  queryString += '}'
  return gql`
    ${queryString}
  `
}

const PRICE_FOR_PAIR_PRICE_CHART = (timestamps: number[]) => {
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

const PRICE_CHART = gql`
  query tokenHourDatas($startTime: Int!, $skip: Int!, $address: String!) {
    tokenHourDatas(
      first: 100
      skip: $skip
      where: { token: $address, periodStartUnix_gt: $startTime }
      orderBy: periodStartUnix
      orderDirection: asc
    ) {
      periodStartUnix
      high
      low
      open
      close
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

interface PriceResults {
  tokenHourDatas: TokenHourDatas[]
}

type PriceResultsForPairPriceChartResult = Record<string, TokenHourDatas[]>

export async function fetchTokenPriceData(
  address: string,
  interval: number,
  startTimestamp: number,
  dataClient: GraphQLClient,
  chainName: MultiChainNameExtend,
): Promise<{
  data: PriceChartEntry[]
  error: boolean
}> {
  // start and end bounds
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
    const timestamps = []
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
    const blocks = await getBlocksFromTimestamps(timestamps, 'asc', 500, chainName)
    if (!blocks || blocks.length === 0) {
      console.error('Error fetching blocks')
      return {
        data: [],
        error: false,
      }
    }

    let data: {
      periodStartUnix: number
      high: string
      low: string
      open: string
      close: string
    }[] = []

    let skip = 0
    let allFound = false
    while (!allFound) {
      // eslint-disable-next-line no-await-in-loop
      const priceData = await dataClient.request<PriceResults>(PRICE_CHART, {
        address,
        startTime: startTimestamp,
        skip,
      })

      if (priceData?.tokenHourDatas?.length > 0) {
        skip += 100
        if (priceData?.tokenHourDatas?.length < 100) {
          allFound = true
        }
        if (priceData) {
          data = data.concat(priceData.tokenHourDatas)
        }
      }
    }

    const formattedHistory = data.map((d) => {
      return {
        time: d.periodStartUnix,
        open: parseFloat(d.open),
        close: parseFloat(d.close),
        high: parseFloat(d.high),
        low: parseFloat(d.low),
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
): Promise<{
  data: PriceChartEntry[]
  error: boolean
}> {
  // start and end bounds
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
    const timestamps = []
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
    const blocks = await getBlocksFromTimestamps(timestamps, 'asc', 500, chainName)
    if (!blocks || blocks.length === 0) {
      console.error('Error fetching blocks')
      return {
        data: [],
        error: false,
      }
    }

    let data: {
      periodStartUnix: number
      high: string
      low: string
      open: string
      close: string
    }[] = []

    // eslint-disable-next-line no-await-in-loop
    const priceData = await dataClient.request<PriceResultsForPairPriceChartResult>(
      PRICE_FOR_PAIR_PRICE_CHART(timestamps),
      {
        address,
      },
    )

    if (Object.keys(priceData)?.length > 0) {
      if (priceData) {
        Object.values(priceData).forEach((d) => {
          data = data.concat(d)
        })
      }
    }

    const formattedHistory = data.map((d) => {
      return {
        time: d.periodStartUnix,
        open: parseFloat(d.open),
        close: parseFloat(d.close),
        high: parseFloat(d.high),
        low: parseFloat(d.low),
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
