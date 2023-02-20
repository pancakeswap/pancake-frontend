/* eslint-disable @typescript-eslint/no-shadow, no-await-in-loop, no-constant-condition, no-console */
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
import { useEffect, useMemo } from 'react'

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
  const key = useMemo(() => {
    if (!currencyA || !currencyB) {
      return ''
    }
    const symbols = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA.symbol, currencyB.symbol]
      : [currencyB.symbol, currencyA.symbol]
    return [...symbols, currencyA.chainId].join('_')
  }, [currencyA, currencyB])
  const pairs = useMemo(() => SmartRouter.getPairCombinations(currencyA, currencyB), [currencyA, currencyB])
  return usePools(pairs, { key })
}

interface PoolsOptions {
  // Used to identify pools to be cached
  key?: string
}

export function usePools(pairs: [Currency, Currency][], { key }: PoolsOptions = {}): PoolsWithState {
  const v2PoolState = useV2Pools(pairs)
  const stablePoolState = useStablePools(pairs)
  const v3PoolState = useV3Pools(pairs, { key })
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
  return function usePools(
    pairs: [Currency, Currency][],
    { key }: PoolsOptions = {},
  ): {
    key?: string
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
        key,
        pools,
        loading: isLoading,
        syncing: isSyncing,
      }
    }, [callStates, poolMetas, poolCallSize, key])
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

export function useV3Pools(pairs: Pair[], { key }: PoolsOptions = {}) {
  const { pools: v3Pools, loading, syncing, key: onChainKey } = useV3PoolsWithoutTicks(pairs, { key })
  const { isLoading, data, isValidating } = useV3PoolsWithTicks(v3Pools, { key })
  const pools = data?.pools || []
  const ticksKey = data?.key

  return {
    key,
    pools,
    loading: loading || ticksKey !== onChainKey || isLoading,
    syncing: syncing || isValidating,
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

export function useV3PoolsWithTicks(pools: V3Pool[], { key }: PoolsOptions = {}) {
  const blockNumber = useCurrentBlock()
  const poolsWithTicks = useSWR(
    key ? ['v3_pool_ticks', key] : null,
    async () => {
      const start = Date.now()
      const poolTicks = await Promise.all(
        pools.map(({ token0, token1, fee }) => {
          return getPoolTicks(getV3PoolAddress(token0, token1, fee))
        }),
      )
      console.log('[METRIC] Getting pool ticks takes', Date.now() - start)

      return {
        pools: pools.map((pool, i) => ({
          ...pool,
          ticks: poolTicks[i],
        })),
        key,
      }
    },
    {
      keepPreviousData: true,
    },
  )

  const { mutate } = poolsWithTicks
  useEffect(() => {
    // Revalidate pools if block number increases
    mutate()
  }, [blockNumber, mutate])

  return poolsWithTicks
}

async function _getPoolTicksByPage(poolAddress: string, page: number, pageSize: number): Promise<Tick[]> {
  const res = await client.request(query, {
    address: poolAddress.toLocaleLowerCase(),
    skip: page * pageSize,
  })

  return res.ticks.map(
    ({ tick, liquidityNet, liquidityGross }) => new Tick({ index: tick, liquidityNet, liquidityGross }),
  )
}

async function getPoolTicks(poolAddress: string): Promise<Tick[]> {
  const BATCH_PAGE = 3
  const PAGE_SIZE = 1000
  let result: Tick[] = []
  let page = 0
  while (true) {
    const pageNums = Array(BATCH_PAGE)
      .fill(page)
      .map((p, i) => p + i)
    const poolsCollections = await Promise.all(pageNums.map((p) => _getPoolTicksByPage(poolAddress, p, PAGE_SIZE)))

    let hasMore = true
    for (const pools of poolsCollections) {
      result = [...result, ...pools]
      if (pools.length !== PAGE_SIZE) {
        hasMore = false
      }
    }
    if (!hasMore) {
      break
    }

    page += BATCH_PAGE
  }
  return result
}
