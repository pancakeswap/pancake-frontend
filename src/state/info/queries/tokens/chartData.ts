import { getUnixTime } from 'date-fns'
import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { TokenChartEntry } from 'state/info/types'
import { PCS_V2_START, ONE_DAY_UNIX } from 'config/constants/info'

interface TokenDayDatas {
  date: number
  dailyVolumeUSD: string
  totalLiquidityUSD: string
}
interface ChartResults {
  tokenDayDatas: TokenDayDatas[]
}

/**
 * Data for drawing Volume and TVL charts on token page
 * Data for price chart comes from priceData.ts
 */
const getTokenChartData = async (
  skip: number,
  address: string,
): Promise<{ tokenDayDatas?: TokenDayDatas[]; error: boolean }> => {
  try {
    const query = gql`
      query tokenDayDatas($startTime: Int!, $skip: Int!, $address: Bytes!) {
        tokenDayDatas(
          first: 1000
          skip: $skip
          where: { token: $address, date_gt: $startTime }
          orderBy: date
          orderDirection: asc
        ) {
          date
          dailyVolumeUSD
          totalLiquidityUSD
        }
      }
    `
    const { tokenDayDatas } = await request<ChartResults>(INFO_CLIENT, query, {
      startTime: PCS_V2_START,
      skip,
      address,
    })
    return { tokenDayDatas, error: false }
  } catch (error) {
    console.error('Failed to fetch token chart data', error)
    return { error: true }
  }
}

const fetchTokenChartData = async (address: string) => {
  let data: TokenChartEntry[] = []
  let error = false
  let skip = 0
  let allFound = false

  while (!allFound) {
    // eslint-disable-next-line no-await-in-loop
    const { tokenDayDatas, error: fetchError } = await getTokenChartData(skip, address)
    skip += 1000
    allFound = tokenDayDatas.length < 1000
    error = fetchError
    if (tokenDayDatas) {
      const parsedDayDatas = tokenDayDatas.map((tokenDayData) => ({
        date: tokenDayData.date,
        volumeUSD: parseFloat(tokenDayData.dailyVolumeUSD),
        totalValueLockedUSD: parseFloat(tokenDayData.totalLiquidityUSD),
      }))
      data = data.concat(parsedDayDatas)
    }
  }

  if (error || data.length === 0) {
    return {
      error: true,
    }
  }

  const formattedDayDatas = data.reduce((accum: { [date: number]: TokenChartEntry }, dayData) => {
    // At this stage we track unix day ordinal for each data point to check for empty days later
    const dayOrdinal = parseInt((dayData.date / ONE_DAY_UNIX).toFixed(0))
    return {
      [dayOrdinal]: dayData,
      ...accum,
    }
  }, {})

  const availableDays = Object.keys(formattedDayDatas).map((dayOrdinal) => parseInt(dayOrdinal, 10))

  const firstAvailableDayData = formattedDayDatas[availableDays[0]]
  // fill in empty days ( there will be no day datas if no trades made that day )
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

export default fetchTokenChartData
