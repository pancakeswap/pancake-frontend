import { request, gql } from 'graphql-request'
import { INFO_CLIENT } from 'config/constants/endpoints'
import { ChartEntry } from 'state/info/types'
import { PCS_V2_START } from 'config/constants/info'
import { TokenDayDatasResponse } from '../types'
import { mapDayData, fetchChartData } from '../helpers'

const getTokenChartData = async (skip: number, address: string): Promise<{ data?: ChartEntry[]; error: boolean }> => {
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
    const { tokenDayDatas } = await request<TokenDayDatasResponse>(INFO_CLIENT, query, {
      startTime: PCS_V2_START,
      skip,
      address,
    })
    const data = tokenDayDatas.map(mapDayData)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch token chart data', error)
    return { error: true }
  }
}

const fetchTokenChartData = async (address: string): Promise<{ data?: ChartEntry[]; error: boolean }> => {
  return fetchChartData(getTokenChartData, address)
}

export default fetchTokenChartData
