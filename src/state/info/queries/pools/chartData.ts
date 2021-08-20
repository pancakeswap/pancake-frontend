import { getUnixTime } from 'date-fns'
import gql from 'graphql-tag'
import { client } from 'config/apolloClient'
import { PoolChartEntry } from 'state/info/types'
import { PCS_V2_START, ONE_DAY_UNIX } from 'config/constants/info'

/**
 * Data for drawing Volume and TVL charts on pool page
 */
const POOL_CHART = gql`
  query pairDayDatas($startTime: Int!, $skip: Int!, $address: Bytes!) {
    pairDayDatas(
      first: 1000
      skip: $skip
      where: { pairAddress: $address, date_gt: $startTime }
      orderBy: date
      orderDirection: asc
    ) {
      date
      dailyVolumeUSD
      reserveUSD
    }
  }
`

interface ChartResults {
  pairDayDatas: {
    date: number
    dailyVolumeUSD: string
    reserveUSD: string
  }[]
}

const fetchPoolChartData = async (address: string) => {
  let data: {
    date: number
    volumeUSD: string
    tvlUSD: string
  }[] = []
  const endTimestamp = getUnixTime(new Date())

  let error = false
  let skip = 0
  let allFound = false

  try {
    while (!allFound) {
      const {
        data: chartResData,
        error: fetchError,
        loading,
        // eslint-disable-next-line no-await-in-loop
      } = await client.query<ChartResults>({
        query: POOL_CHART,
        variables: {
          address,
          startTime: PCS_V2_START,
          skip,
        },
        fetchPolicy: 'cache-first',
      })
      if (!loading) {
        skip += 1000
        if (chartResData.pairDayDatas.length < 1000 || fetchError) {
          allFound = true
        }
        if (chartResData) {
          const fmt = chartResData.pairDayDatas.map((e) => ({
            date: e.date,
            volumeUSD: e.dailyVolumeUSD,
            tvlUSD: e.reserveUSD,
          }))
          data = data.concat(fmt)
        }
      }
    }
  } catch {
    error = true
  }

  if (data) {
    const formattedExisting = data.reduce((accum: { [date: number]: PoolChartEntry }, dayData) => {
      const roundedDate = parseInt((dayData.date / ONE_DAY_UNIX).toFixed(0))
      // TODO PCS: { [roundedDate]: {...}, ...accum }
      // eslint-disable-next-line no-param-reassign
      accum[roundedDate] = {
        date: dayData.date,
        volumeUSD: parseFloat(dayData.volumeUSD),
        totalValueLockedUSD: parseFloat(dayData.tvlUSD),
      }
      return accum
    }, {})

    const firstEntry = formattedExisting[parseInt(Object.keys(formattedExisting)[0])]

    // fill in empty days ( there will be no day datas if no trades made that day )
    let timestamp = firstEntry?.date ?? PCS_V2_START
    let latestTvl = firstEntry?.totalValueLockedUSD ?? 0
    while (timestamp < endTimestamp - ONE_DAY_UNIX) {
      const nextDay = timestamp + ONE_DAY_UNIX
      const currentDayIndex = parseInt((nextDay / ONE_DAY_UNIX).toFixed(0))
      if (!Object.keys(formattedExisting).includes(currentDayIndex.toString())) {
        formattedExisting[currentDayIndex] = {
          date: nextDay,
          volumeUSD: 0,
          totalValueLockedUSD: latestTvl,
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

export default fetchPoolChartData
