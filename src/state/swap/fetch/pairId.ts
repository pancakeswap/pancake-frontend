import { INFO_CLIENT } from 'config/constants/endpoints'
import { GraphQLClient } from 'graphql-request'
import pairIdByTokenIdsQuery from '../queries/pairsIdByTokenIds'

const headers = { 'X-Sf': process.env.REACT_APP_SF_HEADER }

const fetchPairId = async (token0Address, token1Address) => {
  const client = new GraphQLClient(INFO_CLIENT)

  try {
    const data = await client.request(pairIdByTokenIdsQuery, { token0Address, token1Address }, headers)

    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch pairs data', error)
    return { error: true }
  }
}

export default fetchPairId
