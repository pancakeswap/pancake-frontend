import { useAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { QUERY_SETTINGS_IMMUTABLE, SLOW_INTERVAL } from 'config/constants'
import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query'
import { publicClient } from 'utils/viem'
import { masterChefV3ABI } from '@pancakeswap/v3-sdk'
import { masterChefV3Addresses } from '@pancakeswap/farms'

import { farmPoolsAtom } from './atom'
import { fetchFarmPools, fetchPoolsStatusByChainId } from './fetcher'
import { PoolInfo } from '../type'

export const useFarmPools = () => {
  const [loaded, setLoaded] = useState(false)
  const [pools, setPools] = useAtom(farmPoolsAtom)

  useEffect(() => {
    if (!loaded) {
      fetchFarmPools()
        .then(setPools)
        .finally(() => setLoaded(true))
    }
    // only fetch once when mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { loaded, data: pools }
}

export const usePoolsLength = (chainIds: number[]) => {
  const queries = useMemo(() => {
    return chainIds.map((chainId) => {
      return {
        queryKey: [],
        queryFn: () => {
          const client = publicClient({ chainId })
          return client.readContract({
            address: masterChefV3Addresses[chainId],
            abi: masterChefV3ABI,
            functionName: 'poolLength',
          })
        },
        enabled: !!chainId,
        ...QUERY_SETTINGS_IMMUTABLE,
        refetchInterval: SLOW_INTERVAL,
        staleTime: SLOW_INTERVAL,
      }
    })
  }, [chainIds])

  const combine = useCallback(
    (results: UseQueryResult<bigint, Error>[]) => {
      return {
        data: results.reduce((acc, result, idx) => {
          return {
            ...acc,
            [chainIds[idx]]: Number(result.data ?? 0),
          }
        }, {} as { [key: `${number}`]: number }),
        pending: results.some((result) => result.isPending),
      }
    },
    [chainIds],
  )

  return useQueries({
    queries,
    combine,
  })
}

export const usePoolStatus = (pool?: PoolInfo | null) => {
  const { data } = useQuery({
    queryKey: ['usePoolsInfo', pool?.chainId, pool?.pid],
    queryFn: () => {
      return fetchPoolsStatusByChainId(pool!.chainId, [pool!])
    },
    enabled: !!pool?.chainId && !!pool?.pid,
    ...QUERY_SETTINGS_IMMUTABLE,
    refetchInterval: SLOW_INTERVAL,
    staleTime: SLOW_INTERVAL,
  })
  return useMemo(() => (data ? data[0] : []), [data])
}
