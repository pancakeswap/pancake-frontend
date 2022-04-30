import { PCS_V2_START } from 'config/constants/info'
import { gql } from 'graphql-request'
import { ChartEntry } from 'state/info/types'
import { infoClient } from 'utils/graphql'
import { fetchChartData, mapDayData } from '../helpers'
import { TokenDayDatasResponse } from '../types'

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
    const { tokenDayDatas } = await infoClient.request<TokenDayDatasResponse>(query, {
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
