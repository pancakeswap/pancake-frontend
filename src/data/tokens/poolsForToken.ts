import gql from 'graphql-tag'
import { client } from 'config/apolloClient'
import { TOKEN_BLACKLIST } from 'config/info'

/**
 * Data for showing Pools table on the Token page
 */
export const POOLS_FOR_TOKEN = gql`
  query poolsForToken($address: Bytes!, $blacklist: [String!]) {
    asToken0: pairs(
      first: 15
      orderBy: trackedReserveBNB
      orderDirection: desc
      where: { totalTransactions_gt: 100, token0: $address, token1_not_in: $blacklist }
    ) {
      id
    }
    asToken1: pairs(
      first: 15
      orderBy: trackedReserveBNB
      orderDirection: desc
      where: { totalTransactions_gt: 100, token1: $address, token0_not_in: $blacklist }
    ) {
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
export async function fetchPoolsForToken(address: string): Promise<{
  loading: boolean
  error: boolean
  addresses: string[] | undefined
}> {
  try {
    const { loading, error, data } = await client.query<PoolsForTokenResponse>({
      query: POOLS_FOR_TOKEN,
      variables: {
        address,
        blacklist: TOKEN_BLACKLIST,
      },
      fetchPolicy: 'cache-first',
    })

    if (loading || error || !data) {
      return {
        loading,
        error: Boolean(error),
        addresses: undefined,
      }
    }

    const formattedData = data.asToken0.concat(data.asToken1).map((p) => p.id)

    return {
      loading,
      error: Boolean(error),
      addresses: formattedData,
    }
  } catch {
    return {
      loading: false,
      error: true,
      addresses: undefined,
    }
  }
}
