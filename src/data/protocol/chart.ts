/* eslint-disable no-await-in-loop */
import { ChartDayData } from 'types'
import { useState, useEffect } from 'react'
import { getUnixTime } from 'date-fns'
import gql from 'graphql-tag'
import { client } from 'config/apolloClient'
import { PCS_V2_START, ONE_DAY_UNIX } from 'config/info'

/**
 * Data for displaying Liquidity and Volume charts on Overview page
 */
const PANCAKE_DAY_DATAS = gql`
  query overviewCharts($startTime: Int!, $skip: Int!) {
    pancakeDayDatas(first: 1000, skip: $skip, where: { date_gt: $startTime }, orderBy: date, orderDirection: asc) {
      date
      dailyVolumeUSD
      totalLiquidityUSD
    }
  }
`

interface PancakeDayDatas {
  date: number // UNIX timestamp in seconds
  dailyVolumeUSD: string
  totalLiquidityUSD: string
}

interface ChartResults {
  pancakeDayDatas: PancakeDayDatas[]
}

const fetchChartData = async (): Promise<PancakeDayDatas[]> => {
  let data: {
    date: number
    dailyVolumeUSD: string
    totalLiquidityUSD: string
  }[] = []
  let skip = 0
  let allFound = false

  while (!allFound) {
    try {
      const {
        data: { pancakeDayDatas },
        error,
      } = await client.query<ChartResults>({
        query: PANCAKE_DAY_DATAS,
        variables: {
          startTime: PCS_V2_START,
          skip,
        },
        fetchPolicy: 'cache-first',
      })
      if (error) {
        throw error
      }
      skip += 1000
      allFound = pancakeDayDatas.length < 1000
      data = data.concat(pancakeDayDatas)
    } catch (error) {
      console.error('Failed to fetch chart data', error)
      return null
    }
  }

  return data
}

const processChartData = (rawDayDatas: PancakeDayDatas[]): ChartDayData[] => {
  // Format the datas to have number type for volume and liquidity as well as
  const formattedDayDatas = rawDayDatas.reduce((accum: { [date: number]: ChartDayData }, dayData) => {
    // At this stage we track unix day ordinal for each data point to check for empty days later
    const dayOrdinal = parseInt((dayData.date / ONE_DAY_UNIX).toFixed(0), 10)
    // eslint-disable-next-line no-param-reassign
    accum[dayOrdinal] = {
      date: dayData.date,
      volumeUSD: parseFloat(dayData.dailyVolumeUSD),
      liquidityUSD: parseFloat(dayData.totalLiquidityUSD),
    }
    return accum
  }, {})

  const availableDays = Object.keys(formattedDayDatas).map((dayOrdinal) => parseInt(dayOrdinal, 10))

  const firstAvailableDayData = formattedDayDatas[availableDays[0]]

  // Fill in empty days (there will be no day datas if no trades made that day)
  let timestamp = firstAvailableDayData?.date ?? PCS_V2_START
  let latestLiquidityUSD = firstAvailableDayData?.liquidityUSD ?? 0
  const endTimestamp = getUnixTime(new Date())
  while (timestamp < endTimestamp - ONE_DAY_UNIX) {
    timestamp += ONE_DAY_UNIX
    const dayOrdinal = parseInt((timestamp / ONE_DAY_UNIX).toFixed(0), 10)
    if (!availableDays.includes(dayOrdinal)) {
      formattedDayDatas[dayOrdinal] = {
        date: timestamp,
        volumeUSD: 0,
        liquidityUSD: latestLiquidityUSD,
      }
    } else {
      latestLiquidityUSD = formattedDayDatas[dayOrdinal].liquidityUSD
    }
  }

  return Object.values(formattedDayDatas)
}

/**
 * Fetch historic chart data
 */
const useFetchGlobalChartData = (): {
  error: boolean
  data: ChartDayData[] | undefined
} => {
  const [data, setData] = useState<ChartDayData[] | undefined>()
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      const rawChartData = await fetchChartData()
      if (rawChartData) {
        const processedData = processChartData(rawChartData)
        setData(processedData)
      } else {
        setError(true)
      }
    }
    if (!data && !error) {
      fetch()
    }
  }, [data, error])

  return {
    error,
    data,
  }
}

export default useFetchGlobalChartData
