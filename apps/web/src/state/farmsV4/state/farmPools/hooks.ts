import { ChainId } from '@pancakeswap/chains'
import { Protocol, UNIVERSAL_FARMS, UniversalFarmConfig, masterChefV3Addresses } from '@pancakeswap/farms'
import { masterChefAddresses } from '@pancakeswap/farms/src/const'
import { masterChefV3ABI } from '@pancakeswap/v3-sdk'
import { UseQueryResult, useQueries, useQuery } from '@tanstack/react-query'
import { masterChefV2ABI } from 'config/abi/masterchefV2'
import { QUERY_SETTINGS_IMMUTABLE, SLOW_INTERVAL } from 'config/constants'
import dayjs from 'dayjs'
import { useAtom } from 'jotai'
import groupBy from 'lodash/groupBy'
import keyBy from 'lodash/keyBy'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { publicClient } from 'utils/viem'
import { zeroAddress } from 'viem'
import { Address } from 'viem/accounts'

import { PoolInfo, StablePoolInfo, V2PoolInfo } from '../type'
import { farmPoolsAtom } from './atom'
import { fetchFarmPools, fetchPoolsTimeFrame, fetchV3PoolsStatusByChainId } from './fetcher'

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T
type ArrayItemType<T> = T extends Array<infer U> ? U : T

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

  const { data: poolsStatus, pending: isPoolStatusPending } = useMultiChainV3PoolsStatus(UNIVERSAL_FARMS)
  const { data: poolsTimeFrame, pending: isPoolsTimeFramePending } = useMultiChainPoolsTimeFrame(UNIVERSAL_FARMS)

  const poolsWithStatus: ((PoolInfo | UniversalFarmConfig) & { isActiveFarm?: boolean })[] = useMemo(() => {
    const farms = pools.length ? pools : UNIVERSAL_FARMS
    return farms.map((f: PoolInfo | UniversalFarmConfig) => {
      if (f.protocol === Protocol.V3) {
        return {
          ...f,
          isActiveFarm: isPoolStatusPending ? true : poolsStatus[f.chainId]?.[f.lpAddress]?.[0] > 0,
        }
      }
      if (f.protocol === Protocol.V2 || f.protocol === Protocol.STABLE) {
        return {
          ...f,
          isActiveFarm: isPoolsTimeFramePending
            ? true
            : poolsTimeFrame[f.chainId]?.[f.lpAddress]?.startTimestamp <= dayjs().unix() &&
              poolsTimeFrame[f.chainId]?.[f.lpAddress]?.endTimestamp > dayjs().unix(),
        }
      }
      return f
    })
  }, [pools, poolsStatus, isPoolStatusPending, poolsTimeFrame, isPoolsTimeFramePending])

  return { loaded, data: poolsWithStatus }
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

type IPoolsStatusType = {
  [chainId: number]: {
    [lpAddress: Address]: ArrayItemType<UnwrapPromise<ReturnType<typeof fetchV3PoolsStatusByChainId>>>
  }
}

export const useMultiChainV3PoolsStatus = (pools: UniversalFarmConfig[]) => {
  const v3Pools = useMemo(() => pools.filter((p) => p.protocol === Protocol.V3), [pools])
  const poolsGroupByChains = useMemo(() => groupBy(v3Pools, 'chainId'), [v3Pools])
  const poolsEntries = useMemo(() => Object.entries(poolsGroupByChains), [poolsGroupByChains])

  const queries = poolsEntries.map(([chainId, poolList]) => ({
    queryKey: ['useMultiChainV3PoolsStatus', chainId, ...poolList.map((p) => p.lpAddress)],
    queryFn: () => {
      return fetchV3PoolsStatusByChainId(Number(chainId), poolList)
    },
    enabled: !!chainId && !!poolList.length,
    ...QUERY_SETTINGS_IMMUTABLE,
    refetchInterval: SLOW_INTERVAL,
    staleTime: SLOW_INTERVAL,
  }))
  const combine = useCallback(
    (results: UseQueryResult<UnwrapPromise<ReturnType<typeof fetchV3PoolsStatusByChainId>>, Error>[]) => {
      return {
        data: results.reduce((acc, result, idx) => {
          return {
            ...acc,
            [poolsEntries[idx][0]]: keyBy(result.data ?? [], ([, lpAddress]) => lpAddress),
          }
        }, {} as IPoolsStatusType),
        pending: results.some((result) => result.isPending),
      }
    },
    [poolsEntries],
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

export const usePoolTimeFrame = (bCakeWrapperAddress?: Address, chainId?: number) => {
  const { data } = useQuery({
    queryKey: ['usePoolTimeFrame', bCakeWrapperAddress, chainId],
    queryFn: () => {
      return fetchPoolsTimeFrame([bCakeWrapperAddress!], chainId!)
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

type IPoolsTimeFrameType = {
  [chainId: number]: { [lpAddress: Address]: ArrayItemType<UnwrapPromise<ReturnType<typeof fetchPoolsTimeFrame>>> }
}

export const useMultiChainPoolsTimeFrame = (pools: UniversalFarmConfig[]) => {
  const v2Pools = useMemo(
    () =>
      pools.filter((p) => p.protocol === Protocol.V2 || p.protocol === Protocol.STABLE) as Array<
        V2PoolInfo | StablePoolInfo
      >,
    [pools],
  )
  const poolsGroupByChains = useMemo(() => groupBy(v2Pools, 'chainId'), [v2Pools])
  const poolsEntries = useMemo(() => Object.entries(poolsGroupByChains), [poolsGroupByChains])

  const queries = poolsEntries.map(([chainId_, poolList]) => {
    const chainId = Number(chainId_)
    return {
      queryKey: ['useMultiChainPoolTimeFrame', chainId, ...poolList.map((p) => p.lpAddress)],
      queryFn: () => {
        const bCakeAddresses = poolList.map(({ bCakeWrapperAddress }) => bCakeWrapperAddress ?? zeroAddress)
        return fetchPoolsTimeFrame(bCakeAddresses, chainId)
      },
      enabled: !!chainId && !!poolList.length,
      ...QUERY_SETTINGS_IMMUTABLE,
      refetchInterval: SLOW_INTERVAL,
      staleTime: SLOW_INTERVAL,
    }
  })
  const combine = useCallback(
    (results: UseQueryResult<UnwrapPromise<ReturnType<typeof fetchPoolsTimeFrame>>, Error>[]) => {
      return {
        data: results.reduce((acc, result, idx) => {
          let dataIdx = 0
          return {
            ...acc,
            [poolsEntries[idx][0]]: keyBy(result.data ?? [], () => {
              return poolsEntries[idx][1][dataIdx++].lpAddress
            }),
          }
        }, {} as IPoolsTimeFrameType),
        pending: results.some((result) => result.isPending),
      }
    },
    [poolsEntries],
  )
  return useQueries({
    queries,
    combine,
  })
}
