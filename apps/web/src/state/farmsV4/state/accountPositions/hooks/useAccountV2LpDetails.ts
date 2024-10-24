import { ERC20Token } from '@pancakeswap/sdk'
import { useQueries, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useOfficialsAndUserAddedTokensByChainIds } from 'hooks/Tokens'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from 'state'
import { Address } from 'viem'
import { getAccountV2LpDetails, getTrackedV2LpTokens } from '../fetcher'
import { V2LPDetail } from '../type'
import { useLatestTxReceipt } from './useLatestTxReceipt'

export const useAccountV2LpDetails = (chainIds: number[], account?: Address | null) => {
  const tokens = useOfficialsAndUserAddedTokensByChainIds(chainIds)
  const userSavedPairs = useSelector<AppState, AppState['user']['pairs']>(({ user: { pairs } }) => pairs)
  const [lpTokensByChain, setLpTokensByChain] = useState<Record<number, [ERC20Token, ERC20Token][]> | null>(null)

  useEffect(() => {
    const fetchLpTokens = async () => {
      const result: Record<number, [ERC20Token, ERC20Token][]> = {}

      await Promise.all(
        chainIds.map(async (chainId) => {
          const lpTokens = await getTrackedV2LpTokens(chainId, tokens[chainId], userSavedPairs)
          if (lpTokens && lpTokens.length > 0) {
            result[chainId] = lpTokens
          }
        }),
      )

      setLpTokensByChain(result)
    }

    fetchLpTokens()
  }, [chainIds, tokens, userSavedPairs])

  const [latestTxReceipt] = useLatestTxReceipt()
  const queries = useMemo(() => {
    if (!lpTokensByChain) {
      return []
    }

    return Object.entries(lpTokensByChain).map(([chainId, lpTokens]) => {
      return {
        queryKey: ['accountV2LpDetails', account, chainId, lpTokens.length, latestTxReceipt?.blockHash],
        // @todo @ChefJerry add signal
        queryFn: () => getAccountV2LpDetails(Number(chainId), account!, lpTokens),
        enabled: !!account && lpTokens && lpTokens.length > 0,
        select(data) {
          return data.filter((d) => d.nativeBalance.greaterThan('0') || d.farmingBalance.greaterThan('0'))
        },
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        // Prevents re-fetching while the data is still fresh
        staleTime: SLOW_INTERVAL,
      } satisfies UseQueryOptions<V2LPDetail[]>
    })
  }, [account, lpTokensByChain, latestTxReceipt?.blockHash])

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
