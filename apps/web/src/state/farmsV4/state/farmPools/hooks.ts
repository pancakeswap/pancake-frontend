import { useAtom } from 'jotai'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { QUERY_SETTINGS_IMMUTABLE, SLOW_INTERVAL } from 'config/constants'
import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query'
import { publicClient } from 'utils/viem'
import { masterChefV3ABI } from '@pancakeswap/v3-sdk'
import { masterChefV3Addresses } from '@pancakeswap/farms'
import { masterChefAddresses } from '@pancakeswap/farms/src/const'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { ChainId } from '@pancakeswap/chains'
import { Address } from 'viem/accounts'
import { zeroAddress } from 'viem'

import { farmPoolsAtom } from './atom'
import { fetchFarmPools, fetchPoolsLifecyle, fetchV3PoolsStatusByChainId } from './fetcher'
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

export const useV3PoolsLength = (chainIds: number[]) => {
  const queries = useMemo(() => {
    return chainIds.map((chainId) => {
      return {
        queryKey: ['useV3PoolsLength', chainId],
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

export const useV2PoolsLength = (chainIds: number[]) => {
  const queries = useMemo(() => {
    return chainIds.map((chainId) => {
      return {
        queryKey: ['useV2PoolsLength', chainId],
        queryFn: () => {
          const client = publicClient({ chainId })
          return client.readContract({
            address: masterChefAddresses[ChainId.BSC],
            abi: masterChefV2ABI,
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

export const useV3PoolStatus = (pool?: PoolInfo | null) => {
  const { data } = useQuery({
    queryKey: ['usePoolStatus', pool?.chainId, pool?.pid, pool?.protocol],
    queryFn: () => {
      return fetchV3PoolsStatusByChainId(pool!.chainId, [pool!])
    },
    enabled: !!pool?.chainId && !!pool?.pid,
    ...QUERY_SETTINGS_IMMUTABLE,
    refetchInterval: SLOW_INTERVAL,
    staleTime: SLOW_INTERVAL,
  })
  return useMemo(() => (data ? data[0] : []), [data])
}

export const usePoolLifecyle = (bCakeWrapperAddress?: Address, chainId?: number) => {
  const { data } = useQuery({
    queryKey: ['usePoolLifecyle', bCakeWrapperAddress, chainId],
    queryFn: () => {
      return fetchPoolsLifecyle([bCakeWrapperAddress!], chainId!)
    },
    enabled: !!chainId && !!bCakeWrapperAddress && bCakeWrapperAddress !== zeroAddress,
    ...QUERY_SETTINGS_IMMUTABLE,
    refetchInterval: SLOW_INTERVAL,
    staleTime: SLOW_INTERVAL,
  })
  return useMemo(
    () =>
      data
        ? data[0]
        : {
            startTimestamp: 0,
            endTimestamp: 0,
          },
    [data],
  )
}
