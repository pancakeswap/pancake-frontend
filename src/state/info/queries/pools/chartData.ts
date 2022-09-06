import { gql } from 'graphql-request'
import { ChartEntry } from 'state/info/types'
import { PCS_V2_START } from 'config/constants/info'
import { PairDayDatasResponse } from '../types'
import { mapPairDayData, fetchChartData } from '../helpers'
import { multiChainQueryClient, MultiChianName } from '../../constant'

const getPoolChartData = async (
  chainName: MultiChianName,
  skip: number,
  address: string,
): Promise<{ data?: ChartEntry[]; error: boolean }> => {
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
    const { pairDayDatas } = await multiChainQueryClient[chainName].request<PairDayDatasResponse>(query, {
      startTime: PCS_V2_START,
      skip,
      address,
    })
    const data = pairDayDatas.map(mapPairDayData)
    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch pool chart data', error)
    return { error: true }
  }
}

const fetchPoolChartData = async (
  chainName: MultiChianName,
  address: string,
): Promise<{ data?: ChartEntry[]; error: boolean }> => {
  return fetchChartData(chainName, getPoolChartData, address)
}

export default fetchPoolChartData
