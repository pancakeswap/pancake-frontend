import { ERC20Token } from '@pancakeswap/sdk'
import { useQuery } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { chainIdToExplorerInfoChainName, explorerApiClient } from 'state/info/api/client'
import { useAtomValue } from 'jotai/index'
import { poolAprAtom } from 'state/farmsV4/state/poolApr/atom'
import { useMemo } from 'react'

export const useLPApr = (
  protocol: 'v2' | 'v3' | 'stable',
  pair?: {
    liquidityToken: ERC20Token | undefined
  } | null,
) => {
  const key = useMemo(
    () => (pair ? (`${pair?.liquidityToken?.chainId}:${pair?.liquidityToken?.address}` as const) : null),
    [pair],
  )

  const poolApr = useAtomValue(poolAprAtom)[key ?? '']

  const { data: poolData } = useQuery({
    queryKey: ['LP7dApr', pair?.liquidityToken?.address],

    queryFn: async ({ signal }) => {
      if (!pair || !pair.liquidityToken) return undefined

      const data = await explorerApiClient
        .GET(`/cached/pools/apr/${protocol}/{chainName}/{address}`, {
          signal,
          params: {
            path: {
              address: pair?.liquidityToken?.address,
              chainName: chainIdToExplorerInfoChainName[pair?.liquidityToken?.chainId],
            },
          },
        })
        .then((res) => res.data)

      return data?.apr7d ? { lpApr: parseFloat(data.apr7d) * 100 } : undefined
    },

    enabled: Boolean(
      !poolApr?.lpApr && pair && pair.liquidityToken && chainIdToExplorerInfoChainName[pair.liquidityToken?.chainId],
    ),
    refetchInterval: SLOW_INTERVAL,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  return poolData ?? (poolApr ? { lpApr: parseFloat(poolApr.lpApr) * 100 } : undefined)
}
