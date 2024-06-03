import { useQuery } from '@tanstack/react-query'
import { gql } from 'graphql-request'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'
import { v3Clients } from 'utils/graphql'

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
  return useQuery({
    queryKey: [`useFeeTierDistributionQuery-${token0}-${token1}`],

    queryFn: async () => {
      if (!chainId) return undefined
      return v3Clients[chainId].request(query, {
        token0: token0?.toLowerCase(),
        token1: token1?.toLowerCase(),
      })
    },

    enabled: Boolean(token0 && token1 && chainId && v3Clients[chainId]),
    refetchInterval: interval,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}

export function useFeeTierDistributionQuery2(token0: string | undefined, token1: string | undefined, interval: number) {
  const { chainId } = useActiveChainId()
  return useQuery({
    queryKey: [`useFeeTierDistributionQuery2-${token0}-${token1}`],

    queryFn: async ({ signal }) => {
      if (!chainId || !token0 || !token1) return undefined
      return explorerApiClient
        .GET('/cached/pools/v3/{chainName}/list/simple', {
          signal,
          params: {
            path: {
              chainName: chainIdToExplorerInfoChainName[chainId],
            },
            query: {
              token0: token0.toLowerCase(),
              token1: token1.toLowerCase(),
            },
          },
        })
        .then((res) => res.data?.rows)
    },

    enabled: Boolean(token0 && token1 && chainId && v3Clients[chainId]),
    refetchInterval: interval,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
