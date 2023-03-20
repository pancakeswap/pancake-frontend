import useSWRImmutable from 'swr/immutable'
import { useMemo } from 'react'
import { v3Clients } from 'utils/graphql'
import { gql } from 'graphql-request'
import { useActiveChainId } from 'hooks/useActiveChainId'

const query = gql`
  query FeeTierDistribution($token0: String!, $token1: String!) {
    _meta {
      block {
        number
      }
    }
    asToken0: pools(
      orderBy: totalValueLockedToken0
      orderDirection: desc
      where: { token0: $token0, token1: $token1 }
    ) {
      feeTier
      totalValueLockedToken0
      totalValueLockedToken1
    }
    asToken1: pools(
      orderBy: totalValueLockedToken0
      orderDirection: desc
      where: { token0: $token1, token1: $token0 }
    ) {
      feeTier
      totalValueLockedToken0
      totalValueLockedToken1
    }
  }
`

// Philip TODO: add FeeTierDistributionQuery type
export default function useFeeTierDistributionQuery(
  token0: string | undefined,
  token1: string | undefined,
  interval: number,
) {
  const { chainId } = useActiveChainId()
  const { data, isLoading, error } = useSWRImmutable(
    token0 && token1 && v3Clients[chainId] ? `useFeeTierDistributionQuery-${token0}-${token1}` : null,
    async () => {
      return v3Clients[chainId].request(query, {
        token0: token0?.toLowerCase(),
        token1: token1?.toLowerCase(),
      })
    },
    {
      refreshInterval: interval,
    },
  )

  return useMemo(
    () => ({
      error,
      isLoading,
      data,
    }),
    [data, error, isLoading],
  )
}
