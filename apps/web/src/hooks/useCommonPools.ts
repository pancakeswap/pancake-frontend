/* eslint-disable @typescript-eslint/no-shadow, no-await-in-loop, no-constant-condition */
import { Currency, Pair as V2Pair, CurrencyAmount, JSBI, Percent, ChainId } from '@pancakeswap/sdk'
import { gql, GraphQLClient } from 'graphql-request'
import { FeeAmount, computePoolAddress, Tick } from '@pancakeswap/v3-sdk'
import useSWR from 'swr'
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
import { useCurrentBlock } from 'state/block/hooks'
import { getContract } from 'utils'
import { useProviderOrSigner } from 'hooks/useProviderOrSigner'
import IPancakePairABI from 'config/abi/IPancakePair.json'
import IStablePoolABI from 'config/abi/stableSwap.json'
import IPancakeV3Pool from 'config/abi/IPancakeV3Pool.json'

type Pair = [Currency, Currency]

interface PoolsWithState {
  pools: Pool[]
  loading: boolean
  syncing: boolean
}

export function useCommonPools(currencyA?: Currency, currencyB?: Currency): PoolsWithState {
  const pairs = useMemo(() => SmartRouter.getPairCombinations(currencyA, currencyB), [currencyA, currencyB])
  return usePools(pairs)
}

export function usePools(pairs: [Currency, Currency][]): PoolsWithState {
  const v2PoolState = useV2Pools(pairs)
  const stablePoolState = useStablePools(pairs)
  const v3PoolState = useV3Pools(pairs)
  return useMemo(() => {
    const { pools: v2Pools, loading: v2Loading, syncing: v2Syncing } = v2PoolState
    const { pools: stablePools, loading: stableLoading, syncing: stableSyncing } = stablePoolState
    const { pools: v3Pools, loading: v3Loading, syncing: v3Syncing } = v3PoolState
    return {
      pools: [...v2Pools, ...stablePools, ...v3Pools],
      loading: v2Loading || v3Loading || stableLoading,
      syncing: v2Syncing || v3Syncing || stableSyncing,
    }
  }, [v2PoolState, stablePoolState, v3PoolState])
}

interface PoolMeta {
  currencyA: Currency
  currencyB: Currency
  address: string
}

interface OnChainPoolDataHookFactoryParams<TPool extends Pool, TPoolMeta extends PoolMeta> {
  abi: any[]
  usePoolMetas: (pairs: Pair[]) => TPoolMeta[]
  buildPoolInfoCalls: (contract: Contract) => MultiContractsMultiMethodsCallInput[]
  buildPool: (poolMeta: TPoolMeta, data: any[]) => TPool | null
}

function createPoolMetaHook<TPoolMeta extends PoolMeta>(
  getPossiblePoolMetas: (pair: [Currency, Currency]) => TPoolMeta[],
) {
  return function usePoolMetas(pairs: Pair[]) {
    return useMemo<TPoolMeta[]>(() => {
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
  }
}

function createOnChainPoolDataHook<TPool extends Pool, TPoolMeta extends PoolMeta = PoolMeta>({
  abi,
  usePoolMetas,
  buildPoolInfoCalls,
  buildPool,
}: OnChainPoolDataHookFactoryParams<TPool, TPoolMeta>) {
  return function usePools(pairs: [Currency, Currency][]): {
    pools: TPool[]
    loading: boolean
    syncing: boolean
  } {
    const provider = useProviderOrSigner()
    const poolMetas = usePoolMetas(pairs)

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

    return useMemo(() => {
      const pools: TPool[] = []
      let isLoading = false
      let isSyncing = false
      for (let i = 0; i < poolMetas.length; i += 1) {
        const poolCallStates = callStates.slice(i * poolCallSize, (i + 1) * poolCallSize)
        const results: any[] = []
        for (const { result, loading, syncing, error } of poolCallStates) {
          isLoading = isLoading || loading
          isSyncing = isSyncing || syncing
          if (loading || error) {
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
      return {
        pools,
        loading: isLoading,
        syncing: isSyncing,
      }
    }, [callStates, poolMetas, poolCallSize])
  }
}

const useV2Pools = createOnChainPoolDataHook<V2Pool>({
  abi: IPancakePairABI,
  usePoolMetas: createPoolMetaHook(([currencyA, currencyB]) => [
    { address: V2Pair.getAddress(currencyA.wrapped, currencyB.wrapped), currencyA, currencyB },
  ]),
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
  usePoolMetas: createPoolMetaHook(([currencyA, currencyB]) => {
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
  }),
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

function getV3PoolAddress(currencyA: Currency, currencyB: Currency, fee: FeeAmount) {
  const factoryAddress = V3_POOL_FACTORY_ADDRESS[currencyA.chainId as ChainId]
  if (!factoryAddress) {
    return ''
  }
  return computePoolAddress({
    factoryAddress,
    tokenA: currencyA.wrapped,
    tokenB: currencyB.wrapped,
    fee,
  })
}

function getV3PoolMetas([currencyA, currencyB]: [Currency, Currency]) {
  const factoryAddress = V3_POOL_FACTORY_ADDRESS[currencyA.chainId as ChainId]
  if (!factoryAddress) {
    return []
  }
  return [FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((fee) => ({
    address: getV3PoolAddress(currencyA, currencyB, fee),
    currencyA,
    currencyB,
    fee,
  }))
}

const useV3PoolMetas = createPoolMetaHook(getV3PoolMetas)

const useV3PoolsWithoutTicks = createOnChainPoolDataHook<V3Pool, V3PoolMeta>({
  abi: IPancakeV3Pool,
  usePoolMetas: useV3PoolMetas,
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
  buildPool: ({ currencyA, currencyB, fee, address }, [liquidity, slot0]) => {
    if (!liquidity || !slot0) {
      return null
    }
    const { sqrtPriceX96, tick } = slot0
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
      tick: Number(tick),
      address,
    }
  },
})

export function useV3Pools(pairs: Pair[]) {
  const { pools: v3Pools, loading, syncing } = useV3PoolsWithoutTicks(pairs)
  const { isLoading, data: pools = [] } = useV3PoolsWithTicks(v3Pools)

  return {
    pools,
    loading: loading && !pools.length,
    syncing: syncing || isLoading,
  }
}

const query = gql`
  query AllV3Ticks($address: String!, $skip: Int!) {
    ticks(first: 1000, skip: $skip, where: { poolAddress: $address }, orderBy: tickIdx) {
      tick: tickIdx
      liquidityNet
      liquidityGross
    }
  }
`

const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3')

export function useV3PoolsWithTicks(pools: V3Pool[]) {
  const blockNumber = useCurrentBlock()
  const poolsWithTicks = useSWR(
    ['v3_pool_ticks', blockNumber, pools],
    async () => {
      const poolTicks = await Promise.all(
        pools.map(({ token0, token1, fee }) => {
          return getPoolTicks(getV3PoolAddress(token0, token1, fee))
        }),
      )

      return pools.map((pool, i) => ({
        ...pool,
        ticks: poolTicks[i],
      }))
    },
    {
      keepPreviousData: true,
    },
  )
  return poolsWithTicks
}

async function _getPoolTicksByPage(poolAddress: string, page: number): Promise<Tick[]> {
  const res = await client.request(query, {
    address: poolAddress.toLocaleLowerCase(),
    skip: page * 1000,
  })

  return res.ticks.map(
    ({ tick, liquidityNet, liquidityGross }) => new Tick({ index: tick, liquidityNet, liquidityGross }),
  )
}

async function getPoolTicks(poolAddress: string): Promise<Tick[]> {
  const PAGE_SIZE = 3
  let result: Tick[] = []
  let page = 0
  while (true) {
    const [pool1, pool2, pool3] = await Promise.all([
      _getPoolTicksByPage(poolAddress, page),
      _getPoolTicksByPage(poolAddress, page + 1),
      _getPoolTicksByPage(poolAddress, page + 2),
    ])

    result = [...result, ...pool1, ...pool2, ...pool3]
    if (pool1.length === 0 || pool2.length === 0 || pool3.length === 0) {
      break
    }
    page += PAGE_SIZE
  }
  return result
}
