import { INFO_CLIENT } from 'config/constants/endpoints'
import { GraphQLClient } from 'graphql-request'
import lastPairHourDatasQuery from '../queries/lastPairHourDatasQuery'
import lastPairHourIdQuery from '../queries/lastPairHourIdQuery'
import pairHourDatasByIdsQuery from '../queries/pairHourDatasByIdsQuery'
import { PairDataTimeWindowEnum } from '../types'
import { timeWindowIdsCountMapping, getHeaders } from './constants'
import { fetchPairDataParams, LastPairHourIdResponse, PairHoursDatasResponse } from './types'
import { getIdsByTimeWindow, getPairSequentialId } from './utils'

// Fires up `pairHourDatas` queries to StreamingFast
// It is used for both DAY and WEEK time windows (since querying dayData for WEEK doesn't provide enough data points)
const fetchPairHoursData = async ({ pairId, timeWindow }: fetchPairDataParams) => {
  const client = new GraphQLClient(INFO_CLIENT)

  try {
    if (timeWindow === PairDataTimeWindowEnum.DAY) {
      const data = await client.request<PairHoursDatasResponse>(
        lastPairHourDatasQuery,
        { pairId, first: timeWindowIdsCountMapping[timeWindow] },
        getHeaders(),
      )

      return { data, error: false }
    }

    if (timeWindow === PairDataTimeWindowEnum.WEEK) {
      const lastPairHourIdData = await client.request<LastPairHourIdResponse>(
        lastPairHourIdQuery,
        { pairId },
        getHeaders(),
      )
      const pairHourId = getPairSequentialId({ id: lastPairHourIdData?.pairHourDatas[0].id, pairId })
      const pairHourIds = getIdsByTimeWindow({
        pairAddress: pairId,
        pairLastId: pairHourId,
        timeWindow,
        idsCount: timeWindowIdsCountMapping[timeWindow],
      })

      const pairHoursData = await client.request<PairHoursDatasResponse>(
        pairHourDatasByIdsQuery,
        { pairIds: pairHourIds },
        getHeaders(),
      )

      return { data: pairHoursData, error: false }
    }

    return { data: null, error: false }
  } catch (error) {
    console.error('Failed to pairHourDatas data', error)
    return { error: true }
  }
}

export default fetchPairHoursData
