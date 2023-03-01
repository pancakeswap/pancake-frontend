/* eslint-disable @typescript-eslint/no-shadow, no-await-in-loop, no-constant-condition, no-console */
import { BigintIsh, Currency, JSBI, ChainId } from '@pancakeswap/sdk'
import { SmartRouter, Pool } from '@pancakeswap/smart-router/evm'
import { Provider as IProvider } from '@ethersproject/providers'
import useSWR from 'swr'
import { useMemo, useEffect } from 'react'

import { provider } from 'utils/wagmi'

interface Options {
  blockNumber?: JSBI
}

type OnChainProvider = ({ chainId }: { chainId?: ChainId }) => IProvider

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
  return function useCandidatePools(currencyA?: Currency, currencyB?: Currency, { blockNumber }: Options = {}) {
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

    const poolState = useSWR(
      blockNumber && key && pairs ? [poolType, 'pools', key] : null,
      async () => {
        const metricLabel = `[METRIC] Get ${poolType} pools`
        console.time(metricLabel)
        console.timeLog(metricLabel, key)
        const pools = await getPoolsOnChain(pairs, provider, blockNumber)
        console.timeLog(metricLabel, key, pools)
        console.timeEnd(metricLabel)

        return {
          pools,
          key,
          blockNumber,
        }
      },
      {
        revalidateOnFocus: false,
      },
    )

    const { mutate, data, isLoading, isValidating } = poolState
    useEffect(() => {
      // Revalidate pools if block number increases
      mutate()
      // eslint-disable-next-line
    }, [blockNumber])

    return {
      pools: data?.pools ?? null,
      loading: isLoading,
      syncing: isValidating,
      blockNumber: data?.blockNumber,
      key: data?.key,
    }
  }
}
