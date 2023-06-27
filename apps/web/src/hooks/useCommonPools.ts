/* eslint-disable @typescript-eslint/no-shadow, no-await-in-loop, no-constant-condition, no-console */
import { Currency } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/smart-router/evm'
import { useMemo, useCallback } from 'react'

import { useV3CandidatePools, useV3CandidatePoolsWithoutTicks, V3PoolsHookParams, V3PoolsResult } from './useV3Pools'
import { useStableCandidatePools } from './usePoolsOnChain'
import { useV2CandidatePools } from './useV2Pools'

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

function commonPoolsHookCreator({ useV3Pools }: FactoryOptions) {
  return function useCommonPools(
    currencyA?: Currency,
    currencyB?: Currency,
    { blockNumber, allowInconsistentBlock = false, enabled = true }: CommonPoolsParams = {},
  ): PoolsWithState {
    const {
      pools: v3Pools,
      loading: v3Loading,
      syncing: v3Syncing,
      blockNumber: v3BlockNumber,
      refresh: v3Refresh,
    } = useV3Pools(currencyA, currencyB, { blockNumber, enabled })
    const {
      pools: v2Pools,
      loading: v2Loading,
      syncing: v2Syncing,
      blockNumber: v2BlockNumber,
      refresh: v2Refresh,
    } = useV2CandidatePools(currencyA, currencyB, { blockNumber, enabled })
    const {
      pools: stablePools,
      loading: stableLoading,
      syncing: stableSyncing,
      blockNumber: stableBlockNumber,
      refresh: stableRefresh,
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
    // FIXME: allow inconsistent block not working as expected
    const pools = useMemo(
      () =>
        (!v2Loading || v2Pools) &&
        (!v3Loading || v3Pools) &&
        (!stableLoading || stablePools) &&
        (allowInconsistentBlock || !!consistentBlockNumber)
          ? [...(v2Pools || []), ...(v3Pools || []), ...(stablePools || [])]
          : undefined,
      [
        v2Loading,
        v2Pools,
        v3Loading,
        v3Pools,
        stableLoading,
        stablePools,
        allowInconsistentBlock,
        consistentBlockNumber,
      ],
    )

    const refresh = useCallback(() => {
      v3Refresh()
      v2Refresh()
      stableRefresh()
    }, [v3Refresh, v2Refresh, stableRefresh])

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
