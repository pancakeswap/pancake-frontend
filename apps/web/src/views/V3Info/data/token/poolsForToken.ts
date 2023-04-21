import { gql, GraphQLClient } from 'graphql-request'

export const POOLS_FOR_TOKEN = gql`
  query topPools($address: String!) {
    asToken0: pools(first: 200, orderBy: totalValueLockedUSD, orderDirection: desc, where: { token0: $address }) {
      id
    }
    asToken1: pools(first: 200, orderBy: totalValueLockedUSD, orderDirection: desc, where: { token1: $address }) {
      id
    }
  }
`

interface PoolsForTokenResponse {
  asToken0: {
    id: string
  }[]
  asToken1: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export async function fetchPoolsForToken(
  address: string,
  client: GraphQLClient,
): Promise<{
  error: boolean
  addresses: string[] | undefined
}> {
  try {
    const data = await client.request<PoolsForTokenResponse>(POOLS_FOR_TOKEN, {
      address,
    })

    const formattedData = data.asToken0.concat(data.asToken1).map((p) => p.id)

    return {
      error: false,
      addresses: formattedData,
    }
  } catch {
    return {
      error: true,
      addresses: undefined,
    }
  }
}
