/* eslint-disable @typescript-eslint/no-shadow, no-await-in-loop, no-constant-condition, no-console */
import { Currency, JSBI, ZERO } from '@pancakeswap/sdk'
import { Pool } from '@pancakeswap/smart-router/evm'
import { useEffect, useMemo, useState, useCallback } from 'react'

import { useV3CandidatePools } from './useV3Pools'
import { useV2CandidatePools, useStableCandidatePools } from './usePoolsOnChain'
import { useActiveChainId } from './useActiveChainId'

interface PoolsWithState {
  refresh: () => void
  pools: Pool[] | null
  loading: boolean
  syncing: boolean
  blockNumber?: JSBI
}

interface Options {
  blockNumber?: JSBI
}

export function useCommonPools(
  currencyA?: Currency,
  currencyB?: Currency,
  { blockNumber: latestBlockNumber }: Options = {},
): PoolsWithState {
  const { chainId } = useActiveChainId()
  const [blockNumber, setBlockNumber] = useState<JSBI | null | undefined>(null)
  const [pools, setPools] = useState<Pool[] | null | undefined>(null)
  const {
    pools: v3Pools,
    loading: v3Loading,
    syncing: v3Syncing,
    blockNumber: v3BlockNumber,
  } = useV3CandidatePools(currencyA, currencyB, { blockNumber })
  const {
    pools: v2Pools,
    loading: v2Loading,
    syncing: v2Syncing,
    blockNumber: v2BlockNumber,
  } = useV2CandidatePools(currencyA, currencyB, { blockNumber })
  const {
    pools: stablePools,
    loading: stableLoading,
    syncing: stableSyncing,
    blockNumber: stableBlockNumber,
  } = useStableCandidatePools(currencyA, currencyB, { blockNumber })

  const consistentBlockNumber = useMemo(
    () =>
      v2BlockNumber &&
      stableBlockNumber &&
      v3BlockNumber &&
      JSBI.equal(v2BlockNumber, stableBlockNumber) &&
      JSBI.equal(stableBlockNumber, v3BlockNumber)
        ? v2BlockNumber
        : null,
    [v2BlockNumber, v3BlockNumber, stableBlockNumber],
  )

  const refresh = useCallback(() => latestBlockNumber && setBlockNumber(latestBlockNumber), [latestBlockNumber])

  useEffect(() => {
    setBlockNumber(null)
  }, [chainId])

  useEffect(() => {
    if (consistentBlockNumber && v2Pools && v3Pools && stablePools) {
      console.log(
        '[METRIC] Pools updated',
        [...v2Pools, ...stablePools, ...v3Pools],
        'block number',
        consistentBlockNumber.toString(),
      )
      setPools([...v2Pools, ...stablePools, ...v3Pools])
    }
    if (!v2Pools || !v3Pools || !stablePools) {
      setPools(null)
    }
  }, [consistentBlockNumber, v2Pools, v3Pools, stablePools])

  useEffect(() => {
    if (latestBlockNumber && JSBI.greaterThan(latestBlockNumber, ZERO) && !blockNumber) {
      setBlockNumber(latestBlockNumber)
    }
  }, [latestBlockNumber, blockNumber])

  useEffect(() => {
    if (latestBlockNumber && consistentBlockNumber && JSBI.lessThan(consistentBlockNumber, latestBlockNumber)) {
      refresh()
    }
  }, [consistentBlockNumber, latestBlockNumber, refresh])

  const loading = v2Loading || v3Loading || stableLoading
  return {
    refresh,
    pools,
    loading,
    syncing: v2Syncing || v3Syncing || stableSyncing,
  }
}
