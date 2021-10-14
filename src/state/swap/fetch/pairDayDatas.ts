import { INFO_CLIENT } from 'config/constants/endpoints'
import { GraphQLClient } from 'graphql-request'
import lastPairDayIdQuery from '../queries/lastPairDayIdQuery'
import pairDayDatasByIdsQuery from '../queries/pairDayDatasByIdsQuery'
import { timeWindowIdsCountMapping } from './constants'
import { fetchPairDataParams, LastPairDayIdResponse, PairDayDatasResponse } from './types'
import { getIdsByTimeWindow, getPairSequentialId } from './utils'

const headers = { 'X-Sf': process.env.REACT_APP_SF_HEADER }

const fetchPairDayData = async ({ pairId, timeWindow }: fetchPairDataParams) => {
  const client = new GraphQLClient(INFO_CLIENT)
  const lastPairDayIdData = await client.request<LastPairDayIdResponse>(lastPairDayIdQuery, { pairId }, headers)
  const pairDayId = getPairSequentialId({ id: lastPairDayIdData?.pairDayDatas[0].id, pairId })
  const pairDayIds = getIdsByTimeWindow({
    pairAddress: pairId,
    pairLastId: pairDayId,
    timeWindow,
    idsCount: timeWindowIdsCountMapping[timeWindow],
  })

  try {
    if (pairDayIds.length > 0) {
      const pairDayData = await client.request<PairDayDatasResponse>(
        pairDayDatasByIdsQuery,
        { pairIds: pairDayIds },
        headers,
      )

      return { data: pairDayData, error: false }
    }

    return { data: null, error: false }
  } catch (error) {
    console.error('Failed to pairDayDatas data', error)
    return { error: true }
  }
}

export default fetchPairDayData
