import { ChainId, Currency, Token, WNATIVE, Pair } from '@pancakeswap/sdk'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { gql } from 'graphql-request'

import { BASES_TO_CHECK_TRADES_AGAINST } from '../../constants'
import { PoolType, SubgraphProvider, V2Pool } from '../types'
import { metric } from '../utils'

const query = gql`
  query getPools($pageSize: Int!, $poolAddrs: [ID!]) {
    pairs(first: $pageSize, where: { id_in: $poolAddrs }) {
      id
      reserve0
      reserve1
      reserveUSD
    }
  }
`

interface V2PoolMeta {
  address: string
  currencyA: Currency
  currencyB: Currency
}

interface V2PoolSubgraphResult {
  id: string
  reserveUSD: string
  reserve0: string
  reserve1: string
}

interface PoolWithTvl {
  address: string
  tvlUSD: bigint
}

export type SubgraphV2Pool = V2Pool & PoolWithTvl

export const getV2PoolSubgraph = async ({
  provider,
  pairs,
}: {
  provider: SubgraphProvider
  pairs: [Currency, Currency][]
}): Promise<SubgraphV2Pool[]> => {
  const chainId: ChainId = pairs[0]?.[0]?.chainId
  if (!chainId) {
    return []
  }

  const client = provider({ chainId })

  if (!client) {
    // console.error('No subgraph client found for chainId', chainId)
    return []
  }

  const metaMap = new Map<string, V2PoolMeta>()
  const addresses: string[] = []
  for (const pair of pairs) {
    const meta = getV2PoolMeta(pair)
    const address = meta.address.toLocaleLowerCase()
    if (metaMap.get(address)) {
      continue
    }
    metaMap.set(address, meta)
    addresses.push(address)
  }

  metric(`Get V2 pools from subgraph start`, pairs)
  const { pairs: poolsFromSubgraph } = await client.request<{ pairs: V2PoolSubgraphResult[] }>(query, {
    pageSize: 1000,
    poolAddrs: addresses,
  })

  const pools = poolsFromSubgraph
    .map(({ id, reserveUSD, reserve0, reserve1 }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const { currencyA, currencyB, address } = metaMap.get(id.toLocaleLowerCase())!
      const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
        ? [currencyA, currencyB]
        : [currencyB, currencyA]
      const reserve0Amount = tryParseAmount(reserve0, token0)
      const reserve1Amount = tryParseAmount(reserve1, token1)
      if (!reserve0 || !reserve1) {
        return null
      }
      return {
        address,
        type: PoolType.V2 as const,
        reserve0: reserve0Amount,
        reserve1: reserve1Amount,
        tvlUSD: BigInt(Number.parseInt(reserveUSD)),
      }
    })
    .filter((p) => !!p)

  metric(`Got V2 pools from subgraph end`, pools)

  return pools as SubgraphV2Pool[]
}

function getV2PoolMeta([currencyA, currencyB]: [Currency, Currency]): V2PoolMeta {
  return {
    currencyA,
    currencyB,
    address: Pair.getAddress(currencyA.wrapped, currencyB.wrapped),
  }
}

const POOL_SELECTION_CONFIG = {
  topN: 3,
  topNDirectSwaps: 2,
  topNTokenInOut: 2,
  topNSecondHop: 1,
  topNWithEachBaseToken: 3,
  topNWithBaseToken: 3,
}

const sortByTvl = (a: SubgraphV2Pool, b: SubgraphV2Pool) => (a.tvlUSD >= b.tvlUSD ? -1 : 1)

export function v2PoolSubgraphSelection(
  currencyA: Currency,
  currencyB: Currency,
  poolsFromSubgraph: SubgraphV2Pool[],
): V2Pool[] {
  if (!poolsFromSubgraph.length) {
    return []
  }
  const {
    reserve0: {
      currency: { chainId },
    },
  } = poolsFromSubgraph[0]
  const baseTokens: Token[] = BASES_TO_CHECK_TRADES_AGAINST[chainId as ChainId] ?? []

  const poolSet = new Set<string>()
  const addToPoolSet = (pools: SubgraphV2Pool[]) => {
    for (const pool of pools) {
      poolSet.add(pool.address)
    }
  }

  const topByBaseWithTokenIn = baseTokens
    .map((token) => {
      return poolsFromSubgraph
        .filter((subgraphPool) => {
          return (
            (subgraphPool.reserve0.currency.wrapped.equals(token) &&
              subgraphPool.reserve1.currency.wrapped.equals(currencyA.wrapped)) ||
            (subgraphPool.reserve1.currency.wrapped.equals(token) &&
              subgraphPool.reserve0.currency.wrapped.equals(currencyA.wrapped))
          )
        })
        .sort(sortByTvl)
        .slice(0, POOL_SELECTION_CONFIG.topNWithEachBaseToken)
    })
    .reduce<SubgraphV2Pool[]>((acc, cur) => [...acc, ...cur], [])
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
            (subgraphPool.reserve0.currency.wrapped.equals(token) &&
              subgraphPool.reserve1.currency.wrapped.equals(currencyB.wrapped)) ||
            (subgraphPool.reserve1.currency.wrapped.equals(token) &&
              subgraphPool.reserve0.currency.wrapped.equals(currencyB.wrapped))
          )
        })
        .sort(sortByTvl)
        .slice(0, POOL_SELECTION_CONFIG.topNWithEachBaseToken)
    })
    .reduce<SubgraphV2Pool[]>((acc, cur) => [...acc, ...cur], [])
    .sort(sortByTvl)
    .slice(0, POOL_SELECTION_CONFIG.topNWithBaseToken)

  addToPoolSet(topByBaseWithTokenOut)

  const top2DirectPools = poolsFromSubgraph
    .filter((subgraphPool) => {
      if (poolSet.has(subgraphPool.address)) {
        return false
      }
      return (
        (subgraphPool.reserve0.currency.wrapped.equals(currencyA.wrapped) &&
          subgraphPool.reserve1.currency.wrapped.equals(currencyB.wrapped)) ||
        (subgraphPool.reserve1.currency.wrapped.equals(currencyA.wrapped) &&
          subgraphPool.reserve0.currency.wrapped.equals(currencyB.wrapped))
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
            (subgraphPool.reserve0.currency.wrapped.equals(nativeToken) &&
              subgraphPool.reserve1.currency.wrapped.equals(currencyA.wrapped)) ||
            (subgraphPool.reserve1.currency.wrapped.equals(nativeToken) &&
              subgraphPool.reserve0.currency.wrapped.equals(currencyA.wrapped))
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
            (subgraphPool.reserve0.currency.wrapped.equals(nativeToken) &&
              subgraphPool.reserve1.currency.wrapped.equals(currencyB.wrapped)) ||
            (subgraphPool.reserve1.currency.wrapped.equals(nativeToken) &&
              subgraphPool.reserve0.currency.wrapped.equals(currencyB.wrapped))
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
        subgraphPool.reserve0.currency.wrapped.equals(currencyA.wrapped) ||
        subgraphPool.reserve1.currency.wrapped.equals(currencyA.wrapped)
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
        subgraphPool.reserve0.currency.wrapped.equals(currencyB.wrapped) ||
        subgraphPool.reserve1.currency.wrapped.equals(currencyB.wrapped)
      )
    })
    .slice(0, POOL_SELECTION_CONFIG.topNTokenInOut)
  addToPoolSet(topByTVLUsingTokenQuote)

  const topByTVLUsingTokenInSecondHops = topByTVLUsingTokenBase
    .map((subgraphPool) => {
      return subgraphPool.reserve0.currency.wrapped.equals(currencyA.wrapped)
        ? subgraphPool.reserve1.currency
        : subgraphPool.reserve0.currency
    })
    .map((secondHopToken: Currency) => {
      return poolsFromSubgraph
        .filter((subgraphPool) => {
          if (poolSet.has(subgraphPool.address)) {
            return false
          }
          return (
            subgraphPool.reserve0.currency.wrapped.equals(secondHopToken.wrapped) ||
            subgraphPool.reserve1.currency.wrapped.equals(secondHopToken.wrapped)
          )
        })
        .slice(0, POOL_SELECTION_CONFIG.topNSecondHop)
    })
    .reduce<SubgraphV2Pool[]>((acc, cur) => [...acc, ...cur], [])
    .sort(sortByTvl)
    .slice(0, POOL_SELECTION_CONFIG.topNSecondHop)
  addToPoolSet(topByTVLUsingTokenInSecondHops)

  const topByTVLUsingTokenOutSecondHops = topByTVLUsingTokenQuote
    .map((subgraphPool) => {
      return subgraphPool.reserve0.currency.wrapped.equals(currencyB.wrapped)
        ? subgraphPool.reserve1.currency
        : subgraphPool.reserve0.currency
    })
    .map((secondHopToken: Currency) => {
      return poolsFromSubgraph
        .filter((subgraphPool) => {
          if (poolSet.has(subgraphPool.address)) {
            return false
          }
          return (
            subgraphPool.reserve0.currency.wrapped.equals(secondHopToken.wrapped) ||
            subgraphPool.reserve1.currency.wrapped.equals(secondHopToken.wrapped)
          )
        })
        .slice(0, POOL_SELECTION_CONFIG.topNSecondHop)
    })
    .reduce<SubgraphV2Pool[]>((acc, cur) => [...acc, ...cur], [])
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
