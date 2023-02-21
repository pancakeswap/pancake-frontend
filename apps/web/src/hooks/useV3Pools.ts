/* eslint-disable @typescript-eslint/no-shadow, no-await-in-loop, no-constant-condition, no-console */
import { BigintIsh, Currency, JSBI, ChainId, Token, WNATIVE } from '@pancakeswap/sdk'
import {
  SmartRouter,
  V3Pool,
  V3_POOL_FACTORY_ADDRESS,
  PoolType,
  BASES_TO_CHECK_TRADES_AGAINST,
} from '@pancakeswap/smart-router/evm'
import { FeeAmount, computePoolAddress, Tick } from '@pancakeswap/v3-sdk'
import { gql, GraphQLClient } from 'graphql-request'
import useSWR from 'swr'
import { useMemo, useEffect } from 'react'

import { useCurrentBlock } from 'state/block/hooks'

type Pair = [Currency, Currency]

interface SubgraphPool extends V3Pool {
  tvlUSD: JSBI
}

interface Options {
  blockNumber?: BigintIsh
}

const POOL_SELECTION_CONFIG = {
  topN: 3,
  topNDirectSwaps: 1,
  topNTokenInOut: 5,
  topNSecondHop: 2,
  topNWithEachBaseToken: 2,
  topNWithBaseToken: 6,
}

const sortByTvl = (a: SubgraphPool, b: SubgraphPool) => (JSBI.greaterThanOrEqual(a.tvlUSD, b.tvlUSD) ? -1 : 1)

export function useV3CandidatePools(currencyA?: Currency, currencyB?: Currency, options?: Options) {
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
  const { data: poolsFromSubgraph, isLoading, isValidating } = useV3PoolsFromSubgraph(pairs, options)

  const candidatePoolsWithoutTicks = useMemo<V3Pool[] | null>(() => {
    if (!poolsFromSubgraph?.length || !currencyA || !currencyB) {
      return null
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
    return pools.map(({ tvlUSD, ...rest }) => rest)
  }, [poolsFromSubgraph, currencyA, currencyB])

  const {
    data,
    isLoading: ticksLoading,
    isValidating: ticksValidating,
  } = useV3PoolsWithTicks(candidatePoolsWithoutTicks, { key })

  const candidatePools = data?.pools ?? null

  return {
    pools: candidatePools,
    loading: isLoading || ticksLoading,
    syncing: isValidating || ticksValidating,
  }
}

const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3')

export function useV3PoolsWithTicks(pools: V3Pool[], { key }: { key?: string } = {}) {
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
  const query = gql`
    query AllV3Ticks($address: String!, $skip: Int!) {
      ticks(first: 1000, skip: $skip, where: { poolAddress: $address }, orderBy: tickIdx) {
        tick: tickIdx
        liquidityNet
        liquidityGross
      }
    }
  `

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

export function useV3PoolsFromSubgraph(pairs: Pair[], { blockNumber }: Options = {}) {
  const query = gql`
      query getPools($pageSize: Int!, $poolAddrs: [String]) {
        pools(
          first: $pageSize
          ${blockNumber ? `block: { number: ${blockNumber} }` : ``}
          where: { id_in: $poolAddrs }
        ) {
          id
          tick
          sqrtPrice
          feeTier
          liquidity
          totalValueLockedUSD
        }
      }
`
  const result = useSWR<SubgraphPool[]>(
    [pairs],
    async () => {
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
      return poolsFromSubgraph.map(({ id, liquidity, sqrtPrice, tick, totalValueLockedUSD }) => {
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
    },
    { keepPreviousData: true },
  )
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
