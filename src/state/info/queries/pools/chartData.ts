import { getUnixTime } from 'date-fns'
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { PoolChartEntry } from 'state/info/types'
import { PCS_V2_START, ONE_DAY_UNIX } from 'config/constants/info'

interface PairDayDatas {
  date: number
  dailyVolumeUSD: string
  reserveUSD: string
}
interface ChartResults {
  pairDayDatas: PairDayDatas[]
}

/**
 * Data for drawing Volume and TVL charts on pool page
 */
const getPoolChartData = async (
  skip: number,
  address: string,
): Promise<{ pairDayDatas?: PairDayDatas[]; error: boolean }> => {
  try {
    const query = gql`
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
    const { pairDayDatas } = await request<ChartResults>(INFO_CLIENT, query, {
      startTime: PCS_V2_START,
      skip,
      address,
    })
    return { pairDayDatas, error: false }
  } catch (error) {
    console.error('Failed to fetch pool chart data', error)
    return { error: true }
  }
}

const fetchPoolChartData = async (address: string): Promise<{ data?: PoolChartEntry[]; error: boolean }> => {
  let data: PoolChartEntry[] = []
  let error = false
  let skip = 0
  let allFound = false

  while (!allFound) {
    // eslint-disable-next-line no-await-in-loop
    const { pairDayDatas, error: fetchError } = await getPoolChartData(skip, address)
    skip += 1000
    allFound = pairDayDatas.length < 1000 || fetchError
    error = fetchError
    if (pairDayDatas) {
      const parsedDayDatas = pairDayDatas.map((pairDayData) => ({
        date: pairDayData.date,
        volumeUSD: parseFloat(pairDayData.dailyVolumeUSD),
        totalValueLockedUSD: parseFloat(pairDayData.reserveUSD),
      }))
      data = data.concat(parsedDayDatas)
    }
  }

  if (error || data.length === 0) {
    return {
      error: true,
    }
  }

  const formattedDayDatas = data.reduce((accum: { [date: number]: PoolChartEntry }, dayData) => {
    // At this stage we track unix day ordinal for each data point to check for empty days later
    const dayOrdinal = parseInt((dayData.date / ONE_DAY_UNIX).toFixed(0))
    return {
      [dayOrdinal]: dayData,
      ...accum,
    }
  }, {})

  const availableDays = Object.keys(formattedDayDatas).map((dayOrdinal) => parseInt(dayOrdinal, 10))

  const firstAvailableDayData = formattedDayDatas[availableDays[0]]

  // Fill in empty days (there will be no day datas if no trades made that day)
  let timestamp = firstAvailableDayData?.date ?? PCS_V2_START
  let latestLiquidityUSD = firstAvailableDayData?.totalValueLockedUSD ?? 0
  const endTimestamp = getUnixTime(new Date())
  while (timestamp < endTimestamp - ONE_DAY_UNIX) {
    timestamp += ONE_DAY_UNIX
    const dayOrdinal = parseInt((timestamp / ONE_DAY_UNIX).toFixed(0), 10)
    if (!Object.keys(formattedDayDatas).includes(dayOrdinal.toString())) {
      formattedDayDatas[dayOrdinal] = {
        date: timestamp,
        volumeUSD: 0,
        totalValueLockedUSD: latestLiquidityUSD,
      }
    } else {
      latestLiquidityUSD = formattedDayDatas[dayOrdinal].totalValueLockedUSD
    }
  }

  return {
    data: Object.values(formattedDayDatas),
    error: false,
  }
}

export default fetchPoolChartData
