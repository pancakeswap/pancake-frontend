import { INFO_CLIENT } from 'config/constants/endpoints'
import { gql, GraphQLClient } from 'graphql-request'

const fetchPairId = async (token0Address, token1Address) => {
  const client = new GraphQLClient(INFO_CLIENT)

  try {
    const query = gql`
      query pairsQuery($token0Address: String, $token1Address: String) {
        pairs(where: { token0: $token0Address, token1: $token1Address }) {
          id
        }
      }
    `
    const data = await client.request(
      query,
      { token0Address, token1Address },
      { 'X-Sf': process.env.REACT_APP_SF_HEADER },
    )

    return { data, error: false }
  } catch (error) {
    console.error('Failed to fetch pairs data', error)
    return { error: true }
  }
}

export default fetchPairId
