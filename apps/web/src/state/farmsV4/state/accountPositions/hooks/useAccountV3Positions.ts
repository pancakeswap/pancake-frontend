import { useQueries, UseQueryOptions, UseQueryResult } from '@tanstack/react-query'
import { SLOW_INTERVAL } from 'config/constants'
import { useCallback, useMemo } from 'react'
import { Address } from 'viem'
import { getAccountV3Positions } from '../fetcher/v3'
import { PositionDetail } from '../type'
import { useLatestTxReceipt } from './useLatestTxReceipt'

export const useAccountV3Positions = (chainIds: number[], account?: Address | null) => {
  const [latestTxReceipt] = useLatestTxReceipt()
  const queries = useMemo(() => {
    return chainIds.map((chainId) => {
      return {
        queryKey: ['accountV3Positions', account, chainId, latestTxReceipt?.blockHash],
        // @todo @ChefJerry add signal
        queryFn: () => getAccountV3Positions(chainId, account!),
        enabled: !!account && !!chainId,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchInterval: SLOW_INTERVAL,
        // Prevents re-fetching while the data is still fresh
        staleTime: SLOW_INTERVAL,
      } satisfies UseQueryOptions<PositionDetail[]>
    })
  }, [account, chainIds, latestTxReceipt?.blockHash])

  const combine = useCallback((results: UseQueryResult<PositionDetail[], Error>[]) => {
    return {
      data: results.reduce((acc, result) => acc.concat(result.data ?? []), [] as PositionDetail[]),
      pending: results.some((result) => result.isPending),
    }
  }, [])
  return useQueries({
    queries,
    combine,
  })
}
