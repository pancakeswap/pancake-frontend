/* eslint-disable @typescript-eslint/no-shadow, no-await-in-loop, no-constant-condition, no-console */
import { BigintIsh, Currency } from '@pancakeswap/sdk'
import { OnChainProvider, Pool, SmartRouter } from '@pancakeswap/smart-router'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { POOLS_FAST_REVALIDATE } from 'config/pools'
import { createViemPublicClientGetter } from 'utils/viem'

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
    const refetchInterval = useMemo(() => {
      const chainId = currencyA?.chainId
      if (!chainId) {
        return 0
      }
      return POOLS_FAST_REVALIDATE[chainId] || 0
    }, [currencyA?.chainId])

    const key = useMemo(() => {
      if (
        !currencyA ||
        !currencyB ||
        currencyA.chainId !== currencyB.chainId ||
        currencyA.wrapped.equals(currencyB.wrapped)
      ) {
        return ''
      }
      const symbols = currencyA.wrapped.sortsBefore(currencyB.wrapped)
        ? [currencyA.symbol, currencyB.symbol]
        : [currencyB.symbol, currencyA.symbol]
      return [...symbols, currencyA.chainId].join('_')
    }, [currencyA, currencyB])

    const poolState = useQuery({
      queryKey: [poolType, 'pools', key],

      queryFn: async ({ signal }) => {
        if (!blockNumber) {
          throw new Error('Failed to get pools on chain. Missing valid params')
        }
        const label = `[POOLS_ONCHAIN](${poolType}) ${key} at block ${blockNumber}`
        SmartRouter.logger.metric(label)
        const getViemClients = createViemPublicClientGetter({ transportSignal: signal })
        const resolvedPairs = await SmartRouter.getPairCombinations(currencyA, currencyB)
        const pools = await getPoolsOnChain(resolvedPairs ?? [], getViemClients, blockNumber)
        SmartRouter.logger.metric(label, pools)

        return {
          pools,
          key,
          blockNumber,
        }
      },

      enabled: Boolean(enabled && blockNumber && key && currencyA && currencyB),
      refetchInterval,
      refetchOnWindowFocus: false,
    })

    const { refetch, data, isLoading, isFetching: isValidating, dataUpdatedAt } = poolState

    return {
      refresh: refetch,
      pools: data?.pools ?? null,
      loading: isLoading,
      syncing: isValidating,
      blockNumber: data?.blockNumber,
      key: data?.key,
      dataUpdatedAt,
    }
  }
}
