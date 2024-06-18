import { useQuery } from '@tanstack/react-query'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'

export function useFeeTierDistributionQuery(token0: string | undefined, token1: string | undefined, interval: number) {
  const { chainId } = useActiveChainId()
  const [t0, t1] = useMemo(() => [token0?.toLowerCase(), token1?.toLowerCase()].sort(), [token0, token1])
  return useQuery({
    queryKey: [`useFeeTierDistributionQuery2-${t0}-${t1}`],

    queryFn: async ({ signal }) => {
      if (!chainId || !t0 || !t1) return undefined
      const chainName = chainIdToExplorerInfoChainName[chainId]

      if (!chainName) throw new Error(`Unknown chainId: ${chainId}`)

      return explorerApiClient
        .GET('/cached/pools/v3/{chainName}/list/simple', {
          signal,
          params: {
            path: {
              chainName,
            },
            query: {
              token0: t0,
              token1: t1,
            },
          },
        })
        .then((res) => res.data?.rows)
    },

    enabled: Boolean(token0 && token1 && chainId),
    refetchInterval: interval,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
