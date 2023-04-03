import { ChainId, Currency, JSBI, Token, WNATIVE } from '@pancakeswap/sdk'
import { parseProtocolFees, Pool, FeeAmount } from '@pancakeswap/v3-sdk'
import { gql } from 'graphql-request'
import { BASES_TO_CHECK_TRADES_AGAINST } from '../../constants'

import { PoolType, SubgraphProvider, V3Pool } from '../types'
import { metric } from '../utils'
import { V3PoolMeta } from './onChainPoolProviderFactory'

const query = gql`
  query getPools($pageSize: Int!, $poolAddrs: [String]) {
    pools(first: $pageSize, where: { id_in: $poolAddrs }) {
      id
      tick
      sqrtPrice
      feeTier
      liquidity
      feeProtocol
      totalValueLockedUSD
    }
  }
`

type V3PoolSubgraphResult = {
  id: string
  liquidity: string
  sqrtPrice: string
  tick: string
  feeTier: string
  feeProtocol: string
  totalValueLockedUSD: string
}

interface PoolWithTvl {
  tvlUSD: JSBI
}

export type SubgraphV3Pool = V3Pool & PoolWithTvl

export const getV3PoolSubgraph = async ({
  provider,
  pairs,
}: {
  provider: SubgraphProvider
  pairs: [Currency, Currency][]
}): Promise<SubgraphV3Pool[]> => {
  const chainId: ChainId = pairs[0]?.[0]?.chainId
  if (!chainId) {
    return []
  }

  const client = provider({ chainId })

  if (!client) {
    console.error('No subgraph client found for chainId', chainId)
    return []
  }

  metric(`Get V3 pools from subgraph start`, pairs)

  const metaMap = new Map<string, V3PoolMeta>()
  for (const pair of pairs) {
    const v3Metas = getV3PoolMetas(pair)
    for (const meta of v3Metas) {
      metaMap.set(meta.address.toLocaleLowerCase(), meta)
    }
  }
  const addresses = Array.from(metaMap.keys())

  const { pools: poolsFromSubgraph } = await client.request<{ pools: V3PoolSubgraphResult[] }>(query, {
    pageSize: 1000,
    poolAddrs: addresses,
  })

  const pools = poolsFromSubgraph.map(({ id, liquidity, sqrtPrice, tick, totalValueLockedUSD, feeProtocol }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { fee, currencyA, currencyB, address } = metaMap.get(id)!
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA, currencyB]
      : [currencyB, currencyA]
    const [token0ProtocolFee, token1ProtocolFee] = parseProtocolFees(feeProtocol)
    return {
      type: PoolType.V3 as const,
      fee,
      token0,
      token1,
      liquidity: JSBI.BigInt(liquidity),
      sqrtRatioX96: JSBI.BigInt(sqrtPrice),
      tick: Number(tick),
      address,
      tvlUSD: JSBI.BigInt(Number.parseInt(totalValueLockedUSD)),
      token0ProtocolFee,
      token1ProtocolFee,
    }
  })

  metric(`Got V3 pools from subgraph end`, pools)

  return pools
}

function getV3PoolMetas([currencyA, currencyB]: [Currency, Currency]) {
  return [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((fee) => ({
    address: Pool.getAddress(currencyA.wrapped, currencyB.wrapped, fee),
    currencyA,
    currencyB,
    fee,
  }))
}

const POOL_SELECTION_CONFIG = {
  topN: 2,
  topNDirectSwaps: 2,
  topNTokenInOut: 2,
  topNSecondHop: 1,
  topNWithEachBaseToken: 3,
  topNWithBaseToken: 3,
}

const sortByTvl = (a: SubgraphV3Pool, b: SubgraphV3Pool) => (JSBI.greaterThanOrEqual(a.tvlUSD, b.tvlUSD) ? -1 : 1)

export function v3PoolSubgraphSelection(
  currencyA: Currency,
  currencyB: Currency,
  poolsFromSubgraph: SubgraphV3Pool[],
): V3Pool[] {
  if (!poolsFromSubgraph.length) {
    return []
  }
  const {
    token0: { chainId },
  } = poolsFromSubgraph[0]
  const baseTokens: Token[] = BASES_TO_CHECK_TRADES_AGAINST[chainId as ChainId] ?? []

  const poolSet = new Set<string>()
  const addToPoolSet = (pools: SubgraphV3Pool[]) => {
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
    .reduce<SubgraphV3Pool[]>((acc, cur) => [...acc, ...cur], [])
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
    .reduce<SubgraphV3Pool[]>((acc, cur) => [...acc, ...cur], [])
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
        (subgraphPool.token1.wrapped.equals(currencyA.wrapped) && subgraphPool.token0.wrapped.equals(currencyB.wrapped))
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
    .reduce<SubgraphV3Pool[]>((acc, cur) => [...acc, ...cur], [])
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
    .reduce<SubgraphV3Pool[]>((acc, cur) => [...acc, ...cur], [])
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
}
