import { ChainId } from '@pancakeswap/chains'
import { gql, GraphQLClient } from 'graphql-request'

import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { POOL_HIDE } from '../../constants'

export const TOP_POOLS = gql`
  query topPools {
    pools(first: 50, orderBy: totalValueLockedUSD, orderDirection: desc) {
      id
    }
  }
`

interface TopPoolsResponse {
  pools: {
    id: string
  }[]
}

/**
 * Fetch top addresses by volume
 */
export async function fetchTopPoolAddresses(
  dataClient: GraphQLClient,
  chainId: ChainId,
): Promise<{
  error: boolean
  addresses: string[] | undefined
}> {
  try {
    const data = await dataClient.request<TopPoolsResponse>(TOP_POOLS, {
      client: dataClient,
      fetchPolicy: 'cache-first',
    })

    const formattedData = (
      data
        ? data.pools
            .map((p) => {
              if (POOL_HIDE?.[chainId]?.includes(p.id.toLowerCase())) {
                return undefined
              }
              return p.id
            })
            .filter((pool) => !isUndefinedOrNull(pool))
        : undefined
    ) as string[] | undefined

    return {
      error: false,
      addresses: formattedData,
    }
  } catch (e) {
    console.error(e)
    return {
      error: false,
      addresses: undefined,
    }
  }
}
