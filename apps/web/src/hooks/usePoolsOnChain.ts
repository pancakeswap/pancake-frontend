/* eslint-disable @typescript-eslint/no-shadow, no-await-in-loop, no-constant-condition, no-console */
import { BigintIsh, Currency } from '@pancakeswap/sdk'
import { OnChainProvider, Pool, SmartRouter } from '@pancakeswap/smart-router/evm'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useEffect, useRef } from 'react'

import { getViemClients } from 'utils/viem'

interface Options {
  blockNumber?: number
  enabled?: boolean
}

export const useV2CandidatePools = candidatePoolsOnChainHookFactory('V2', SmartRouter.getV2PoolsOnChain)

export const useStableCandidatePools = candidatePoolsOnChainHookFactory('Stable', SmartRouter.getStablePoolsOnChain)

export const useV3PoolsWithoutTicksOnChain = candidatePoolsOnChainHookFactory(
  'V3 without ticks',
  SmartRouter.getV3PoolsWithoutTicksOnChain,
)

function candidatePoolsOnChainHookFactory<TPool extends Pool>(
  poolType: string,
  getPoolsOnChain: (
    pairs: [Currency, Currency][],
    provider: OnChainProvider,
    blockNumber: BigintIsh,
  ) => Promise<TPool[]>,
) {
  return function useCandidatePools(
    currencyA?: Currency,
    currencyB?: Currency,
    { blockNumber, enabled = true }: Options = {},
  ) {
    const fetchingBlock = useRef<string | null>(null)
    const key = useMemo(() => {
      if (!currencyA || !currencyB || currencyA.wrapped.equals(currencyB.wrapped)) {
        return ''
      }
      const symbols = currencyA.wrapped.sortsBefore(currencyB.wrapped)
        ? [currencyA.symbol, currencyB.symbol]
        : [currencyB.symbol, currencyA.symbol]
      return [...symbols, currencyA.chainId].join('_')
    }, [currencyA, currencyB])

    const pairs = useMemo(() => {
      return currencyA && currencyB && SmartRouter.getPairCombinations(currencyA, currencyB)
    }, [currencyA, currencyB])

    const queryEnabled = !!(enabled && blockNumber && key && pairs)
    const poolState = useQuery(
      [poolType, 'pools', key],
      async () => {
        fetchingBlock.current = blockNumber.toString()
        try {
          const label = `[POOLS_ONCHAIN](${poolType}) ${key} at block ${fetchingBlock.current}`
          SmartRouter.metric(label)
          const pools = await getPoolsOnChain(pairs, getViemClients, blockNumber)
          SmartRouter.metric(label, pools)

          return {
            pools,
            key,
            blockNumber,
          }
        } finally {
          fetchingBlock.current = null
        }
      },
      {
        enabled: queryEnabled,
        refetchOnWindowFocus: false,
      },
    )

    const { refetch, data, isLoading, isFetching: isValidating } = poolState
    useEffect(() => {
      // Revalidate pools if block number increases
      if (
        queryEnabled &&
        blockNumber &&
        fetchingBlock.current !== blockNumber.toString() &&
        (!data?.blockNumber || blockNumber > data.blockNumber)
      ) {
        refetch()
      }
      // eslint-disable-next-line
    }, [blockNumber, data?.blockNumber, queryEnabled])

    return {
      refresh: refetch,
      pools: data?.pools ?? null,
      loading: isLoading,
      syncing: isValidating,
      blockNumber: data?.blockNumber,
      key: data?.key,
    }
  }
}
