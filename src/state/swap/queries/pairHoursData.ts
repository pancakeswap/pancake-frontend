import { INFO_CLIENT } from 'config/constants/endpoints'
import { gql, GraphQLClient } from 'graphql-request'
import { FetchPairHoursDataResponse } from './types'

const fetchPairHoursData = async (pairId) => {
  const client = new GraphQLClient(INFO_CLIENT)

  try {
    const query = gql`
      query pairHourDatasQuery($pairId: String) {
        pairHourDatas(first: 24, where: { pair: $pairId }) {
          id
          hourStartUnix
          pair {
            name
            timestamp
            token0Price
            token1Price
          }
        }
      }
    `
    const data = await client.request<FetchPairHoursDataResponse>(
      query,
      { pairId },
      { 'X-Sf': process.env.REACT_APP_SF_HEADER },
    )
    return { data, error: false }
  } catch (error) {
    console.error('Failed to pairHourDatas data', error)
    return { error: true }
  }
}

export default fetchPairHoursData
