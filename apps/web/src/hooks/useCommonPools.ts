/* eslint-disable @typescript-eslint/no-shadow, no-await-in-loop, no-constant-condition, no-console */
import { Currency } from '@pancakeswap/sdk'
import { usePropsChanged, usePreviousValue } from '@pancakeswap/hooks'
import { Pool } from '@pancakeswap/smart-router/evm'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { useV3CandidatePools, useV3CandidatePoolsWithoutTicks, V3PoolsHookParams, V3PoolsResult } from './useV3Pools'
import { useStableCandidatePools, useV2CandidatePools } from './usePoolsOnChain'
import { useActiveChainId } from './useActiveChainId'

interface FactoryOptions {
  // use to identify hook
  key: string

  useV3Pools: (currencyA?: Currency, currencyB?: Currency, params?: V3PoolsHookParams) => V3PoolsResult
}

export interface PoolsWithState {
  refresh: () => void
  pools: Pool[] | null
  loading: boolean
  syncing: boolean
  blockNumber?: number
}

export interface CommonPoolsParams {
  blockNumber?: number
  allowInconsistentBlock?: boolean
  enabled?: boolean
}

function commonPoolsHookCreator({ key, useV3Pools }: FactoryOptions) {
  return function useCommonPools(
    currencyA?: Currency,
    currencyB?: Currency,
    { blockNumber: latestBlockNumber, allowInconsistentBlock = false, enabled = true }: CommonPoolsParams = {},
  ): PoolsWithState {
    const client = useQueryClient()
    const currenciesUpdated = usePropsChanged(currencyA, currencyB)
    const { chainId } = useActiveChainId()
    const [blockNumber, setBlockNumber] = useState<number | null | undefined>(null)
    const {
      pools: v3Pools,
      loading: v3Loading,
      syncing: v3Syncing,
      blockNumber: v3BlockNumber,
    } = useV3Pools(currencyA, currencyB, { blockNumber, enabled })
    const {
      pools: v2Pools,
      loading: v2Loading,
      syncing: v2Syncing,
      blockNumber: v2BlockNumber,
    } = useV2CandidatePools(currencyA, currencyB, { blockNumber, enabled })
    const {
      pools: stablePools,
      loading: stableLoading,
      syncing: stableSyncing,
      blockNumber: stableBlockNumber,
    } = useStableCandidatePools(currencyA, currencyB, { blockNumber, enabled })

    const consistentBlockNumber = useMemo(
      () =>
        v2BlockNumber &&
        stableBlockNumber &&
        v3BlockNumber &&
        v2BlockNumber === stableBlockNumber &&
        stableBlockNumber === v3BlockNumber
          ? v2BlockNumber
          : null,
      [v2BlockNumber, v3BlockNumber, stableBlockNumber],
    )
    const pairKey = useMemo(
      () => currencyA && currencyB && [currencyA.symbol, currencyB.symbol, currencyA.chainId],
      [currencyA, currencyB],
    )
    const previousPairKey = usePreviousValue(pairKey)
    const poolKey = useMemo(
      () =>
        pairKey &&
        v2BlockNumber &&
        v3BlockNumber &&
        stableBlockNumber &&
        (allowInconsistentBlock || consistentBlockNumber) && [
          ...pairKey,
          consistentBlockNumber?.toString(),
          v2BlockNumber,
          v3BlockNumber,
          stableBlockNumber,
        ],
      [pairKey, consistentBlockNumber, v2BlockNumber, v3BlockNumber, stableBlockNumber, allowInconsistentBlock],
    )
    const {
      data: pools,
      refetch,
      isFetched,
    } = useQuery<Pool[] | null>([key, ...(pairKey || [])], () => [...v2Pools, ...stablePools, ...v3Pools], {
      enabled: !!(v2Pools && v3Pools && stablePools && poolKey),
    })

    const refresh = useCallback(() => latestBlockNumber && setBlockNumber(latestBlockNumber), [latestBlockNumber])

    useEffect(() => {
      setBlockNumber(null)
    }, [chainId])

    useEffect(() => {
      if (latestBlockNumber && latestBlockNumber > 0 && !blockNumber) {
        setBlockNumber(latestBlockNumber)
      }
    }, [latestBlockNumber, blockNumber])

    useEffect(() => {
      if (latestBlockNumber && consistentBlockNumber && consistentBlockNumber < latestBlockNumber) {
        refresh()
      }
    }, [consistentBlockNumber, latestBlockNumber, refresh])

    useEffect(() => {
      if (latestBlockNumber && isFetched) {
        refetch()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [latestBlockNumber, refetch])

    useEffect(() => {
      if (currenciesUpdated && previousPairKey) {
        client.removeQueries({ queryKey: [key, ...previousPairKey] })
      }
    }, [currenciesUpdated, client, previousPairKey])

    const loading = v2Loading || v3Loading || stableLoading
    const syncing = v2Syncing || v3Syncing || stableSyncing
    return {
      refresh,
      pools,
      blockNumber: consistentBlockNumber,
      loading,
      syncing,
    }
  }
}

export const useCommonPools = commonPoolsHookCreator({ key: 'useCommonPools', useV3Pools: useV3CandidatePools })

// In lite version, we don't query ticks data from subgraph
export const useCommonPoolsLite = commonPoolsHookCreator({
  key: 'useCommonPoolsLite',
  useV3Pools: useV3CandidatePoolsWithoutTicks,
})
