/* eslint-disable @typescript-eslint/no-shadow, no-await-in-loop, no-constant-condition, no-console */
import { Currency, JSBI, ChainId, Token, WNATIVE, ZERO } from '@pancakeswap/sdk'
import { SmartRouter, V3Pool, PoolType, BASES_TO_CHECK_TRADES_AGAINST } from '@pancakeswap/smart-router/evm'
import { FeeAmount, computePoolAddress, Tick, DEPLOYER_ADDRESSES } from '@pancakeswap/v3-sdk'
import { gql } from 'graphql-request'
import { v3Clients } from 'utils/graphql'
import useSWR from 'swr'
import { useMemo, useEffect } from 'react'
import { getPoolTicks } from './v3/useAllV3TicksQuery'

type Pair = [Currency, Currency]

interface SubgraphPool extends V3Pool {
  tvlUSD: JSBI
}

export interface V3PoolsHookParams {
  // Used for caching
  key?: string

  blockNumber?: number
}

export interface V3PoolsResult {
  pools: V3Pool[] | null
  loading: boolean
  syncing: boolean
  blockNumber?: number
}

const POOL_SELECTION_CONFIG = {
  topN: 2,
  topNDirectSwaps: 2,
  topNTokenInOut: 2,
  topNSecondHop: 1,
  topNWithEachBaseToken: 3,
  topNWithBaseToken: 3,
}

const sortByTvl = (a: SubgraphPool, b: SubgraphPool) => (JSBI.greaterThanOrEqual(a.tvlUSD, b.tvlUSD) ? -1 : 1)

export function useV3CandidatePools(
  currencyA?: Currency,
  currencyB?: Currency,
  options?: V3PoolsHookParams,
): V3PoolsResult {
  const {
    pools: candidatePoolsWithoutTicks,
    loading: isLoading,
    syncing: isValidating,
    key,
    blockNumber,
  } = useV3CandidatePoolsWithoutTicks(currencyA, currencyB, options)

  const {
    data,
    isLoading: ticksLoading,
    isValidating: ticksValidating,
  } = useV3PoolsWithTicks(candidatePoolsWithoutTicks, {
    key,
    blockNumber,
  })

  const candidatePools = data?.pools ?? null

  return {
    pools: candidatePools,
    loading: isLoading || ticksLoading,
    syncing: isValidating || ticksValidating,
    blockNumber: data?.blockNumber,
  }
}

export function useV3CandidatePoolsWithoutTicks(
  currencyA?: Currency,
  currencyB?: Currency,
  options?: V3PoolsHookParams,
) {
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
    console.log('[METRIC] Getting pairs from', currencyA?.symbol, currencyB?.symbol)
    return currencyA && currencyB && SmartRouter.getPairCombinations(currencyA, currencyB)
  }, [currencyA, currencyB])
  const { data: poolsFromSubgraphState, isLoading, isValidating } = useV3PoolsFromSubgraph(pairs, { ...options, key })

  const candidatePools = useMemo<V3Pool[] | null>(() => {
    if (!poolsFromSubgraphState?.pools || !currencyA || !currencyB) {
      return null
    }
    const { pools: poolsFromSubgraph } = poolsFromSubgraphState
    if (!poolsFromSubgraph.length) {
      return []
    }
    const {
      token0: { chainId },
    } = poolsFromSubgraph[0]
    const baseTokens: Token[] = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []

    const poolSet = new Set<string>()
    const addToPoolSet = (pools: SubgraphPool[]) => {
      for (const pool of pools) {
        poolSet.add(pool.address)
      }
    }

    const topByBaseWithTokenIn = baseTokens
      .map((token) => {
        return poolsFromSubgraph
          .filter((subgraphPool) => {
            return (
              (subgraphPool.token0.wrapped.equals(token) && subgraphPool.token1.wrapped.equals(currencyA.wrapped)) ||
              (subgraphPool.token1.wrapped.equals(token) && subgraphPool.token0.wrapped.equals(currencyA.wrapped))
            )
          })
          .sort(sortByTvl)
          .slice(0, POOL_SELECTION_CONFIG.topNWithEachBaseToken)
      })
      .reduce<SubgraphPool[]>((acc, cur) => [...acc, ...cur], [])
      .sort(sortByTvl)
      .slice(0, POOL_SELECTION_CONFIG.topNWithBaseToken)

    addToPoolSet(topByBaseWithTokenIn)

    const topByBaseWithTokenOut = baseTokens
      .map((token) => {
        return poolsFromSubgraph
          .filter((subgraphPool) => {
            if (poolSet.has(subgraphPool.address)) {
              return false
            }
            return (
              (subgraphPool.token0.wrapped.equals(token) && subgraphPool.token1.wrapped.equals(currencyB.wrapped)) ||
              (subgraphPool.token1.wrapped.equals(token) && subgraphPool.token0.wrapped.equals(currencyB.wrapped))
            )
          })
          .sort(sortByTvl)
          .slice(0, POOL_SELECTION_CONFIG.topNWithEachBaseToken)
      })
      .reduce<SubgraphPool[]>((acc, cur) => [...acc, ...cur], [])
      .sort(sortByTvl)
      .slice(0, POOL_SELECTION_CONFIG.topNWithBaseToken)

    addToPoolSet(topByBaseWithTokenOut)

    const top2DirectPools = poolsFromSubgraph
      .filter((subgraphPool) => {
        if (poolSet.has(subgraphPool.address)) {
          return false
        }
        return (
          (subgraphPool.token0.wrapped.equals(currencyA.wrapped) &&
            subgraphPool.token1.wrapped.equals(currencyB.wrapped)) ||
          (subgraphPool.token1.wrapped.equals(currencyA.wrapped) &&
            subgraphPool.token0.wrapped.equals(currencyB.wrapped))
        )
      })
      .slice(0, POOL_SELECTION_CONFIG.topNDirectSwaps)

    addToPoolSet(top2DirectPools)

    const nativeToken = WNATIVE[chainId]
    const top2EthBaseTokenPool = nativeToken
      ? poolsFromSubgraph
          .filter((subgraphPool) => {
            if (poolSet.has(subgraphPool.address)) {
              return false
            }
            return (
              (subgraphPool.token0.wrapped.equals(nativeToken) &&
                subgraphPool.token1.wrapped.equals(currencyA.wrapped)) ||
              (subgraphPool.token1.wrapped.equals(nativeToken) && subgraphPool.token0.wrapped.equals(currencyA.wrapped))
            )
          })
          .slice(0, 1)
      : []
    addToPoolSet(top2EthBaseTokenPool)

    const top2EthQuoteTokenPool = nativeToken
      ? poolsFromSubgraph
          .filter((subgraphPool) => {
            if (poolSet.has(subgraphPool.address)) {
              return false
            }
            return (
              (subgraphPool.token0.wrapped.equals(nativeToken) &&
                subgraphPool.token1.wrapped.equals(currencyB.wrapped)) ||
              (subgraphPool.token1.wrapped.equals(nativeToken) && subgraphPool.token0.wrapped.equals(currencyB.wrapped))
            )
          })
          .slice(0, 1)
      : []
    addToPoolSet(top2EthQuoteTokenPool)

    const topByTVL = poolsFromSubgraph.slice(0, POOL_SELECTION_CONFIG.topN).filter((pool) => !poolSet.has(pool.address))
    addToPoolSet(topByTVL)

    const topByTVLUsingTokenBase = poolsFromSubgraph
      .filter((subgraphPool) => {
        if (poolSet.has(subgraphPool.address)) {
          return false
        }
        return (
          subgraphPool.token0.wrapped.equals(currencyA.wrapped) || subgraphPool.token1.wrapped.equals(currencyA.wrapped)
        )
      })
      .slice(0, POOL_SELECTION_CONFIG.topNTokenInOut)
    addToPoolSet(topByTVLUsingTokenBase)

    const topByTVLUsingTokenQuote = poolsFromSubgraph
      .filter((subgraphPool) => {
        if (poolSet.has(subgraphPool.address)) {
          return false
        }
        return (
          subgraphPool.token0.wrapped.equals(currencyB.wrapped) || subgraphPool.token1.wrapped.equals(currencyB.wrapped)
        )
      })
      .slice(0, POOL_SELECTION_CONFIG.topNTokenInOut)
    addToPoolSet(topByTVLUsingTokenQuote)

    const topByTVLUsingTokenInSecondHops = topByTVLUsingTokenBase
      .map((subgraphPool) => {
        return subgraphPool.token0.wrapped.equals(currencyA.wrapped) ? subgraphPool.token1 : subgraphPool.token0
      })
      .map((secondHopToken: Currency) => {
        return poolsFromSubgraph
          .filter((subgraphPool) => {
            if (poolSet.has(subgraphPool.address)) {
              return false
            }
            return (
              subgraphPool.token0.wrapped.equals(secondHopToken.wrapped) ||
              subgraphPool.token1.wrapped.equals(secondHopToken.wrapped)
            )
          })
          .slice(0, POOL_SELECTION_CONFIG.topNSecondHop)
      })
      .reduce<SubgraphPool[]>((acc, cur) => [...acc, ...cur], [])
      .sort(sortByTvl)
      .slice(0, POOL_SELECTION_CONFIG.topNSecondHop)
    addToPoolSet(topByTVLUsingTokenInSecondHops)

    const topByTVLUsingTokenOutSecondHops = topByTVLUsingTokenQuote
      .map((subgraphPool) => {
        return subgraphPool.token0.wrapped.equals(currencyB.wrapped) ? subgraphPool.token1 : subgraphPool.token0
      })
      .map((secondHopToken: Currency) => {
        return poolsFromSubgraph
          .filter((subgraphPool) => {
            if (poolSet.has(subgraphPool.address)) {
              return false
            }
            return (
              subgraphPool.token0.wrapped.equals(secondHopToken.wrapped) ||
              subgraphPool.token1.wrapped.equals(secondHopToken.wrapped)
            )
          })
          .slice(0, POOL_SELECTION_CONFIG.topNSecondHop)
      })
      .reduce<SubgraphPool[]>((acc, cur) => [...acc, ...cur], [])
      .sort(sortByTvl)
      .slice(0, POOL_SELECTION_CONFIG.topNSecondHop)
    addToPoolSet(topByTVLUsingTokenOutSecondHops)

    const pools = [
      ...topByBaseWithTokenIn,
      ...topByBaseWithTokenOut,
      ...top2DirectPools,
      ...top2EthBaseTokenPool,
      ...top2EthQuoteTokenPool,
      ...topByTVL,
      ...topByTVLUsingTokenBase,
      ...topByTVLUsingTokenQuote,
      ...topByTVLUsingTokenInSecondHops,
      ...topByTVLUsingTokenOutSecondHops,
    ]
    // eslint-disable-next-line
    return pools.map(({ tvlUSD, ...rest }) => rest).filter(({ liquidity }) => JSBI.greaterThan(liquidity, ZERO))
  }, [poolsFromSubgraphState, currencyA, currencyB])

  return {
    pools: candidatePools,
    loading: isLoading,
    syncing: isValidating,
    blockNumber: poolsFromSubgraphState?.blockNumber,
    key: poolsFromSubgraphState?.key,
  }
}

export function useV3PoolsWithTicks(pools: V3Pool[] | null | undefined, { key, blockNumber }: V3PoolsHookParams = {}) {
  const poolsWithTicks = useSWR(
    key && pools ? ['v3_pool_ticks', key] : null,
    async () => {
      const label = `[V3_POOL_TICKS] ${key} ${blockNumber?.toString()}`
      console.time(label)
      const poolTicks = await Promise.all(
        pools.map(async ({ token0, token1, fee }) => {
          return getPoolTicks(token0.chainId, getV3PoolAddress(token0, token1, fee)).then((data) => {
            return data.map(
              ({ tick, liquidityNet, liquidityGross }) =>
                new Tick({ index: Number(tick), liquidityNet, liquidityGross }),
            )
          })
        }),
      )
      console.timeLog(label, poolTicks)
      console.timeEnd(label)
      return {
        pools: pools.map((pool, i) => ({
          ...pool,
          ticks: poolTicks[i],
        })),
        key,
        blockNumber,
      }
    },
    {
      revalidateOnFocus: false,
    },
  )

  const { mutate } = poolsWithTicks
  useEffect(() => {
    // Revalidate pools if block number increases
    mutate()
  }, [blockNumber, mutate])

  return poolsWithTicks
}

export function useV3PoolsFromSubgraph(pairs?: Pair[], { key, blockNumber }: V3PoolsHookParams = {}) {
  const result = useSWR<{
    pools: SubgraphPool[]
    key?: string
    blockNumber?: number
  }>(
    key && pairs?.length && [key],
    async () => {
      const { chainId } = pairs[0][0]
      const client = v3Clients[chainId]
      // NOTE: remove block number for now for better performance
      const query = gql`
        query getPools($pageSize: Int!, $poolAddrs: [String]) {
          pools(first: $pageSize, where: { id_in: $poolAddrs }) {
            id
            tick
            sqrtPrice
            feeTier
            liquidity
            totalValueLockedUSD
          }
        }
      `
      if (!client) {
        console.log('[METRIC] Cannot get v3 on chain', pairs[0][0].chainId, 'for now')
        return {
          pools: [],
          key,
          blockNumber,
        }
      }
      const label = `[V3_POOLS_SUBGRAPH] ${key}`
      console.time(label)
      console.timeLog(label, pairs)
      const metaMap = new Map<string, V3PoolMeta>()
      for (const pair of pairs) {
        const v3Metas = getV3PoolMetas(pair)
        for (const meta of v3Metas) {
          metaMap.set(meta.address.toLocaleLowerCase(), meta)
        }
      }
      const addresses = Array.from(metaMap.keys())
      const { pools: poolsFromSubgraph } = await client.request(query, {
        pageSize: 1000,
        poolAddrs: addresses,
      })
      const pools = poolsFromSubgraph.map(({ id, liquidity, sqrtPrice, tick, totalValueLockedUSD }) => {
        const { fee, currencyA, currencyB, address } = metaMap.get(id)
        const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
          ? [currencyA, currencyB]
          : [currencyB, currencyA]
        return {
          type: PoolType.V3,
          fee,
          token0,
          token1,
          liquidity: JSBI.BigInt(liquidity),
          sqrtRatioX96: JSBI.BigInt(sqrtPrice),
          tick: Number(tick),
          address,
          tvlUSD: JSBI.BigInt(Number.parseInt(totalValueLockedUSD)),
        }
      })
      console.timeLog(label, pools)
      console.timeEnd(label)
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

  const { mutate } = result
  useEffect(() => {
    // Revalidate pools if block number increases
    mutate()
  }, [blockNumber, mutate])
  return result
}

interface PoolMeta {
  currencyA: Currency
  currencyB: Currency
  address: string
}

interface V3PoolMeta extends PoolMeta {
  fee: FeeAmount
}

function getV3PoolMetas([currencyA, currencyB]: [Currency, Currency]) {
  const deployerAddress = DEPLOYER_ADDRESSES[currencyA.chainId as ChainId]
  if (!deployerAddress) {
    return []
  }
  return [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((fee) => ({
    address: getV3PoolAddress(currencyA, currencyB, fee),
    currencyA,
    currencyB,
    fee,
  }))
}

function getV3PoolAddress(currencyA: Currency, currencyB: Currency, fee: FeeAmount) {
  const deployerAddress = DEPLOYER_ADDRESSES[currencyA.chainId as ChainId]
  if (!deployerAddress) {
    return ''
  }
  return computePoolAddress({
    deployerAddress,
    tokenA: currencyA.wrapped,
    tokenB: currencyB.wrapped,
    fee,
  })
}
