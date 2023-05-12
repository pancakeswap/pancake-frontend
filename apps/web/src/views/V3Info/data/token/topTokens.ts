import { gql, GraphQLClient } from 'graphql-request'

const TVL_FILTER = 100_000 // 100k

export const TOP_TOKENS = gql`
  query topPools {
    tokens(first: 50,where:{ totalValueLockedUSD_gte:${TVL_FILTER},derivedUSD_gt:0 }, orderBy: totalValueLockedUSD, orderDirection: desc) {
      id
    }
  }
`

interface TopTokensResponse {
  tokens: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export async function fetchTopTokenAddresses(dataClient: GraphQLClient): Promise<{
  error: boolean
  addresses: string[] | undefined
}> {
  try {
    const data = await dataClient.request<TopTokensResponse>(TOP_TOKENS)
    return {
      error: false,
      addresses: data ? data.tokens.map((t) => t.id) : undefined,
    }
  } catch (e) {
    return {
      error: true,
      addresses: undefined,
    }
  }
}
