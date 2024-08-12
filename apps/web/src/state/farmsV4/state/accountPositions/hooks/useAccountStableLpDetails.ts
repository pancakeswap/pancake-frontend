import { LegacyRouter } from '@pancakeswap/smart-router/legacy-router'
import { useQueries, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useCallback, useMemo } from 'react'
import { Address } from 'viem'
import { getStablePairDetails } from '../fetcher'
import { StableLPDetail } from '../type'

export const useAccountStableLpDetails = (chainIds: number[], account?: Address | null) => {
  const queries = useMemo(() => {
    return chainIds.map((chainId) => {
      const stablePairs = LegacyRouter.stableSwapPairsByChainId[chainId]
      return {
        queryKey: ['accountStableLpBalance', account, chainId],
        // @todo @ChefJerry add signal
        queryFn: () => getStablePairDetails(chainId, account!, stablePairs),
        enabled: !!account && stablePairs && stablePairs.length > 0,
        select(data) {
          return data.filter((d) => d.nativeBalance.greaterThan('0') || d.farmingBalance.greaterThan('0'))
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: SLOW_INTERVAL,
      } satisfies UseQueryOptions<StableLPDetail[]>
    })
  }, [account, chainIds])

  const combine = useCallback((results: UseQueryResult<StableLPDetail[], Error>[]) => {
    return {
      data: results.reduce((acc, result) => acc.concat(result.data ?? []), [] as StableLPDetail[]),
      pending: results.some((result) => result.isPending),
    }
  }, [])
  return useQueries({
    queries,
    combine,
  })
}
