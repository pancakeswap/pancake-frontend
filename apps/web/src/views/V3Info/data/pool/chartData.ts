import dayjs from 'dayjs'
import BigNumber from 'bignumber.js'
import utc from 'dayjs/plugin/utc'
import weekOfYear from 'dayjs/plugin/weekOfYear'

import { gql, GraphQLClient } from 'graphql-request'
import { PoolChartEntry } from '../../types'

// format dayjs with the libraries that we need
dayjs.extend(utc)
dayjs.extend(weekOfYear)
const ONE_DAY_UNIX = 24 * 60 * 60

const POOL_CHART = gql`
  query poolDayDatas($startTime: Int!, $skip: Int!, $address: Bytes!) {
    poolDayDatas(
      first: 1000
      skip: $skip
      where: { pool: $address, date_gt: $startTime }
      orderBy: date
      orderDirection: asc
    ) {
      date
      volumeUSD
      tvlUSD
      feesUSD
      protocolFeesUSD
      pool {
        feeTier
      }
    }
  }
`

interface ChartResults {
  poolDayDatas: {
    date: number
    volumeUSD: string
    tvlUSD: string
    feesUSD: string
    protocolFeesUSD: string
    pool: {
      feeTier: string
    }
  }[]
}

export async function fetchPoolChartData(address: string, client: GraphQLClient) {
  let data: {
    date: number
    volumeUSD: string
    tvlUSD: string
    feesUSD: string
    protocolFeesUSD: string
    pool: {
      feeTier: string
    }
  }[] = []
  const startTimestamp = 1619170975
  const endTimestamp = dayjs.utc().unix()

  let error = false
  let skip = 0
  let allFound = false

  try {
    while (!allFound) {
      // eslint-disable-next-line no-await-in-loop
      const chartData = await client.request<ChartResults>(POOL_CHART, {
        address,
        startTime: startTimestamp,
        skip,
      })
      if (chartData.poolDayDatas.length > 0) {
        skip += 1000
        if (chartData.poolDayDatas.length < 1000 || error) {
          allFound = true
        }
        if (chartData.poolDayDatas) {
          data = data.concat(chartData.poolDayDatas)
        }
      }
    }
  } catch (e) {
    console.error(e)
    error = true
  }

  if (data) {
    const formattedExisting = data.reduce((accum: { [date: number]: PoolChartEntry }, dayData) => {
      const roundedDate = parseInt((dayData.date / ONE_DAY_UNIX).toFixed(0))
      const feePercent = parseFloat(dayData.pool.feeTier) / 10000
      const tvlAdjust = dayData?.volumeUSD ? parseFloat(dayData.volumeUSD) * feePercent : 0

      // eslint-disable-next-line no-param-reassign
      accum[roundedDate] = {
        date: dayData.date,
        volumeUSD: parseFloat(dayData.volumeUSD),
        totalValueLockedUSD: parseFloat(dayData.tvlUSD) - tvlAdjust,
        feesUSD: new BigNumber(dayData.feesUSD).minus(dayData.protocolFeesUSD).toNumber(),
      }
      return accum
    }, {})

    const firstEntry = formattedExisting[parseInt(Object.keys(formattedExisting)[0])]

    // fill in empty days ( there will be no day datas if no trades made that day )
    let timestamp = firstEntry?.date ?? startTimestamp
    let latestTvl = firstEntry?.totalValueLockedUSD ?? 0
    while (timestamp < endTimestamp - ONE_DAY_UNIX) {
      const nextDay = timestamp + ONE_DAY_UNIX
      const currentDayIndex = parseInt((nextDay / ONE_DAY_UNIX).toFixed(0))
      if (!Object.keys(formattedExisting).includes(currentDayIndex.toString())) {
        formattedExisting[currentDayIndex] = {
          date: nextDay,
          volumeUSD: 0,
          totalValueLockedUSD: latestTvl,
          feesUSD: 0,
        }
      } else {
        latestTvl = formattedExisting[currentDayIndex].totalValueLockedUSD
      }
      timestamp = nextDay
    }

    const dateMap = Object.keys(formattedExisting).map((key) => {
      return formattedExisting[parseInt(key)]
    })

    return {
      data: dateMap,
      error: false,
    }
  }
  return {
    data: undefined,
    error,
  }
}
