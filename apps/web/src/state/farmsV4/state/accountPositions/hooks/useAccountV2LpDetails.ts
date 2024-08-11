import { ERC20Token } from '@pancakeswap/sdk'
import { useQueries, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { useOfficialsAndUserAddedTokens } from 'hooks/Tokens'
import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { Address } from 'viem'
import { getAccountV2LpDetails, getTrackedV2LpTokens } from '../fetcher'
import { V2LPDetail } from '../type'

export const useAccountV2LpDetails = (chainIds: number[], account?: Address | null) => {
  const tokens = useOfficialsAndUserAddedTokens()
  const userSavedPairs = useSelector<AppState, AppState['user']['pairs']>(({ user: { pairs } }) => pairs)
  const lpTokensByChain = useMemo(() => {
    const result: Record<number, [ERC20Token, ERC20Token][]> = {}
    chainIds.forEach((chainId) => {
      const lpTokens = getTrackedV2LpTokens(chainId, tokens, userSavedPairs)
      if (lpTokens && lpTokens.length > 0) {
        result[chainId] = lpTokens
      }
    })
    return result
  }, [chainIds, tokens, userSavedPairs])
  const queries = useMemo(() => {
    return Object.entries(lpTokensByChain).map(([chainId, lpTokens]) => {
      return {
        queryKey: ['accountV2LpDetails', account, chainId],
        // @todo @ChefJerry add signal
        queryFn: () => getAccountV2LpDetails(Number(chainId), account!, lpTokens),
        enabled: !!account && lpTokens && lpTokens.length > 0,
        select(data) {
          return data.filter((d) => d.nativeBalance.greaterThan('0') || d.farmingBalance.greaterThan('0'))
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: false,
      } satisfies UseQueryOptions<V2LPDetail[]>
    })
  }, [account, lpTokensByChain])

  const combine = useCallback((results: UseQueryResult<V2LPDetail[], Error>[]) => {
    return {
      data: results.reduce((acc, result) => acc.concat(result.data ?? []), [] as V2LPDetail[]),
      pending: results.some((result) => result.isPending),
    }
  }, [])

  return useQueries({
    queries,
    combine,
  })
}
