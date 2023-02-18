/* eslint-disable @typescript-eslint/no-shadow */
import { Currency, Pair, CurrencyAmount, JSBI, Percent, ChainId } from '@pancakeswap/sdk'
import { FeeAmount, computePoolAddress } from '@pancakeswap/v3-sdk'
import {
  Pool,
  SmartRouter,
  PoolType,
  V2Pool,
  StablePool,
  getStableSwapPools,
  V3Pool,
  V3_POOL_FACTORY_ADDRESS,
} from '@pancakeswap/smart-router/evm'
import { Contract } from '@ethersproject/contracts'
import { deserializeToken } from '@pancakeswap/token-lists'
import { useMemo } from 'react'

import { MultiContractsMultiMethodsCallInput, useMultiContractsMultiMethods } from 'state/multicall/hooks'
import { getContract } from 'utils'
import { useProviderOrSigner } from 'hooks/useProviderOrSigner'
import IPancakePairABI from 'config/abi/IPancakePair.json'
import IStablePoolABI from 'config/abi/stableSwap.json'
import IPancakeV3Pool from 'config/abi/IPancakeV3Pool.json'

export function useCommonPools(currencyA?: Currency, currencyB?: Currency): Pool[] {
  const pairs = useMemo(() => SmartRouter.getPairCombinations(currencyA, currencyB), [currencyA, currencyB])
  return usePools(pairs)
}

export function usePools(pairs: [Currency, Currency][]): Pool[] {
  const v2Pools = useV2Pools(pairs)
  const stablePools = useStablePools(pairs)
  const v3Pools = useV3PoolsWithoutTicks(pairs)
  return useMemo(() => [...v2Pools, ...stablePools, ...v3Pools], [v2Pools, stablePools, v3Pools])
}

interface PoolMeta {
  currencyA: Currency
  currencyB: Currency
  address: string
}

interface OnChainPoolDataHookFactoryParams<TPool extends Pool, TPoolMeta extends PoolMeta> {
  abi: any[]
  getPossiblePoolMetas: (pair: [Currency, Currency]) => TPoolMeta[]
  buildPoolInfoCalls: (contract: Contract) => MultiContractsMultiMethodsCallInput[]
  buildPool: (poolMeta: TPoolMeta, data: any[]) => TPool | null
}

function createOnChainPoolDataHook<TPool extends Pool, TPoolMeta extends PoolMeta = PoolMeta>({
  abi,
  getPossiblePoolMetas,
  buildPoolInfoCalls,
  buildPool,
}: OnChainPoolDataHookFactoryParams<TPool, TPoolMeta>) {
  return function usePools(pairs: [Currency, Currency][]): TPool[] {
    const provider = useProviderOrSigner()
    const poolMetas = useMemo<TPoolMeta[]>(() => {
      const poolAddressSet = new Set<string>()

      const metas: TPoolMeta[] = []
      for (const pair of pairs) {
        const possiblePoolMetas = getPossiblePoolMetas(pair)
        for (const meta of possiblePoolMetas) {
          if (!poolAddressSet.has(meta.address)) {
            metas.push(meta)
            poolAddressSet.add(meta.address)
          }
        }
      }
      return metas
    }, [pairs])

    const [callInputs, poolCallSize] = useMemo(() => {
      let calls: MultiContractsMultiMethodsCallInput[] = []
      let poolCallSize = 0
      for (const { address } of poolMetas) {
        const contract = getContract(address, abi, provider)
        const poolCalls: MultiContractsMultiMethodsCallInput[] = buildPoolInfoCalls(contract)
        if (!poolCallSize) {
          poolCallSize = poolCalls.length
        }
        if (!poolCallSize || poolCallSize !== poolCalls.length) {
          throw new Error('Inconsistent pool data call')
        }
        calls = [...calls, ...poolCalls]
      }
      return [calls, poolCallSize]
    }, [poolMetas, provider])

    const callStates = useMultiContractsMultiMethods(callInputs)

    return useMemo<TPool[]>(() => {
      const pools: TPool[] = []
      for (let i = 0; i < poolMetas.length; i += 1) {
        const poolCallStates = callStates.slice(i * poolCallSize, (i + 1) * poolCallSize)
        const results: any[] = []
        for (const { result, loading, syncing, error } of poolCallStates) {
          if (loading || syncing || error) {
            break
          }
          results.push(result)
        }
        if (results.length !== poolCallSize) {
          continue
        }

        const pool = buildPool(poolMetas[i], results)
        if (pool) {
          pools.push(pool)
        }
      }
      return pools
    }, [callStates, poolMetas, poolCallSize])
  }
}

const useV2Pools = createOnChainPoolDataHook<V2Pool>({
  abi: IPancakePairABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => [
    { address: Pair.getAddress(currencyA.wrapped, currencyB.wrapped), currencyA, currencyB },
  ],
  buildPoolInfoCalls: (contract) => [
    {
      contract,
      methodName: 'getReserves',
    },
  ],
  buildPool: ({ currencyA, currencyB }, [reserves]) => {
    if (!reserves) {
      return null
    }
    const { reserve0, reserve1 } = reserves
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    return {
      type: PoolType.V2,
      reserve0: CurrencyAmount.fromRawAmount(token0, reserve0),
      reserve1: CurrencyAmount.fromRawAmount(token1, reserve1),
    }
  },
})

interface StablePoolMeta extends PoolMeta {
  address: string
}

const useStablePools = createOnChainPoolDataHook<StablePool, StablePoolMeta>({
  abi: IStablePoolABI,
  getPossiblePoolMetas: ([currencyA, currencyB]) => {
    const poolConfigs = getStableSwapPools(currencyA.chainId)
    return poolConfigs
      .filter(({ token, quoteToken }) => {
        const tokenA = deserializeToken(token)
        const tokenB = deserializeToken(quoteToken)
        return (
          (tokenA.equals(currencyA.wrapped) && tokenB.equals(currencyB.wrapped)) ||
          (tokenA.equals(currencyB.wrapped) && tokenB.equals(currencyA.wrapped))
        )
      })
      .map(({ stableSwapAddress }) => ({
        address: stableSwapAddress,
        currencyA,
        currencyB,
      }))
  },
  buildPoolInfoCalls: (contract) => [
    {
      contract,
      methodName: 'balances',
      inputs: [0],
    },
    {
      contract,
      methodName: 'balances',
      inputs: [1],
    },
    {
      contract,
      methodName: 'A',
    },
    {
      contract,
      methodName: 'fee',
    },
    {
      contract,
      methodName: 'FEE_DENOMINATOR',
    },
  ],
  buildPool: ({ currencyA, currencyB, address }, [balance0, balance1, a, fee, feeDenominator]) => {
    if (!balance0 || !balance1 || !a || !fee || !feeDenominator) {
      return null
    }
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    return {
      address,
      type: PoolType.STABLE,
      balances: [CurrencyAmount.fromRawAmount(token0, balance0), CurrencyAmount.fromRawAmount(token1, balance1)],
      amplifier: JSBI.BigInt(a),
      fee: new Percent(JSBI.BigInt(fee), JSBI.BigInt(feeDenominator)),
    }
  },
})

interface V3PoolMeta extends PoolMeta {
  fee: FeeAmount
}

const useV3PoolsWithoutTicks = createOnChainPoolDataHook<V3Pool, V3PoolMeta>({
  abi: IPancakeV3Pool,
  getPossiblePoolMetas: ([currencyA, currencyB]) => {
    const factoryAddress = V3_POOL_FACTORY_ADDRESS[currencyA.chainId as ChainId]
    if (!factoryAddress) {
      return []
    }
    return [FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((fee) => ({
      address: computePoolAddress({
        factoryAddress,
        tokenA: currencyA.wrapped,
        tokenB: currencyB.wrapped,
        fee,
      }),
      currencyA,
      currencyB,
      fee,
    }))
  },
  buildPoolInfoCalls: (contract) => [
    {
      contract,
      methodName: 'liquidity',
    },
    {
      contract,
      methodName: 'slot0',
    },
  ],
  buildPool: ({ currencyA, currencyB, fee }, [liquidity, slot0]) => {
    if (!liquidity || !slot0) {
      return null
    }
    const { sqrtPriceX96 } = slot0
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    return {
      type: PoolType.V3,
      token0,
      token1,
      fee,
      liquidity: JSBI.BigInt(liquidity),
      sqrtRatioX96: JSBI.BigInt(sqrtPriceX96),
    }
  },
})
