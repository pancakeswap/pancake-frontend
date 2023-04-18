import { ChainId } from '@pancakeswap/sdk'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { gql, GraphQLClient } from 'graphql-request'
import { ChartDayData } from '../../types'
import { fetchDerivedProtocolTVLHistory } from './derived'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)
const ONE_DAY_UNIX = 24 * 60 * 60

const GLOBAL_CHART = gql`
  query pancakeDayDatas($startTime: Int!, $skip: Int!) {
    pancakeDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
      id
      date
      volumeUSD
      tvlUSD
    }
  }
`

interface ChartResults {
  pancakeDayDatas: {
    date: number
    volumeUSD: string
    tvlUSD: string
  }[]
}

export async function fetchChartData(client: GraphQLClient) {
  let data: {
    date: number
    volumeUSD: string
    tvlUSD: string
  }[] = []
  const startTimestamp = 1619170975
  const endTimestamp = dayjs.utc().unix()

  let error = false
  const skip = 0

  try {
    const chartData = await client.request<ChartResults>(GLOBAL_CHART, {
      startTime: startTimestamp,
      skip,
    })
    data = chartData.pancakeDayDatas
  } catch {
    error = true
  }

  if (data) {
    const formattedExisting = data.reduce((accum: { [date: number]: ChartDayData }, dayData) => {
      const roundedDate = parseInt((dayData.date / ONE_DAY_UNIX).toFixed(0))
      // eslint-disable-next-line no-param-reassign
      accum[roundedDate] = {
        date: dayData.date,
        volumeUSD: parseFloat(dayData.volumeUSD),
        tvlUSD: parseFloat(dayData.tvlUSD),
      }
      return accum
    }, {})

    const firstEntry = formattedExisting[parseInt(Object.keys(formattedExisting)[0])]

    // fill in empty days ( there will be no day datas if no trades made that day )
    let timestamp = firstEntry?.date ?? startTimestamp
    let latestTvl = firstEntry?.tvlUSD ?? 0
    while (timestamp < endTimestamp - ONE_DAY_UNIX) {
      const nextDay = timestamp + ONE_DAY_UNIX
      const currentDayIndex = parseInt((nextDay / ONE_DAY_UNIX).toFixed(0))
      if (!Object.keys(formattedExisting).includes(currentDayIndex.toString())) {
        formattedExisting[currentDayIndex] = {
          date: nextDay,
          volumeUSD: 0,
          tvlUSD: latestTvl,
        }
      } else {
        latestTvl = formattedExisting[currentDayIndex].tvlUSD
      }
      timestamp = nextDay
    }

    return {
      data: Object.values(formattedExisting),
      error: false,
    }
  }
  return {
    data: undefined,
    error,
  }
}

/**
 * Fetch historic chart data
 */

export async function fetchGlobalChartData(
  dataClient: GraphQLClient,
  chainId: ChainId,
): Promise<{
  error: boolean
  data: ChartDayData[] | undefined
}> {
  try {
    const derivedData = await fetchDerivedProtocolTVLHistory(dataClient, chainId)
    const { data } = await fetchChartData(dataClient)

    const shouldUserDerivedData = chainId === ChainId.ETHEREUM

    // @TODO: remove this once we have fix for mainnet TVL issue
    const formattedData = shouldUserDerivedData ? derivedData : data

    return {
      error: false,
      data: formattedData,
    }
  } catch (e) {
    console.error(e)
    return {
      error: true,
      data: undefined,
    }
  }
}
