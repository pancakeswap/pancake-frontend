import { ChainId, Currency, Token } from '@pancakeswap/sdk'
import { parseProtocolFees, Pool, FeeAmount } from '@pancakeswap/v3-sdk'
import { gql } from 'graphql-request'
import type { GraphQLClient } from 'graphql-request'
import memoize from 'lodash/memoize'
import { Address, getAddress } from 'viem'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'

import { PoolType, SubgraphProvider, V2PoolWithTvl, V3PoolWithTvl, WithTvl } from '../../types'
import { computeV2PoolAddress, metric } from '../../utils'
import { PoolMeta, V3PoolMeta } from './internalTypes'

interface FactoryParams<M extends PoolMeta, P extends WithTvl> {
  // Function identifier
  id: string

  getPoolMetas: (pair: [Currency, Currency]) => M[]
  getPoolsFromSubgraph: (params: {
    addresses: Address[]
    getPoolMetaByAddress: (address: Address) => M | null
    client: GraphQLClient
  }) => Promise<(P | null)[]>
}

function subgraphPoolProviderFactory<M extends PoolMeta, P extends WithTvl>({
  id,
  getPoolMetas,
  getPoolsFromSubgraph,
}: FactoryParams<M, P>) {
  return async function subgraphPoolProvider({
    provider,
    pairs,
  }: {
    provider?: SubgraphProvider
    pairs: [Currency, Currency][]
  }): Promise<P[]> {
    if (!provider) {
      throw new Error('No valid subgraph data provider')
    }
    const chainId: ChainId = pairs[0]?.[0]?.chainId
    if (!chainId) {
      return []
    }

    const client = provider({ chainId })

    if (!client) {
      console.error('No subgraph client found for chainId', chainId)
      return []
    }

    metric(`SUBGRAPH_POOLS_START(${id})`, pairs)

    const metaMap = new Map<Address, M>()
    for (const pair of pairs) {
      const metas = getPoolMetas(pair)
      for (const meta of metas) {
        metaMap.set(meta.address.toLocaleLowerCase() as Address, meta)
      }
    }
    const addresses = Array.from(metaMap.keys())

    const pools = await getPoolsFromSubgraph({
      addresses,
      getPoolMetaByAddress: (address) => metaMap.get(address.toLocaleLowerCase() as Address) ?? null,
      client,
    })

    metric(`SUBGRAPH_POOLS_END(${id})`, pools)

    return pools.filter<P>((p): p is P => !!p)
  }
}

const getV3PoolMeta = memoize(
  ([currencyA, currencyB, feeAmount]: [Currency, Currency, FeeAmount]) => ({
    address: Pool.getAddress(currencyA.wrapped, currencyB.wrapped, feeAmount),
    currencyA,
    currencyB,
    fee: feeAmount,
  }),
  ([currencyA, currencyB, feeAmount]) => {
    if (currencyA.wrapped.equals(currencyB.wrapped)) {
      return [currencyA.chainId, currencyA.wrapped.address, feeAmount].join('_')
    }
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA.wrapped, currencyB.wrapped]
      : [currencyB.wrapped, currencyA.wrapped]
    return [token0.chainId, token0.address, token1.address, feeAmount].join('_')
  },
)

const getV3PoolMetas = memoize(
  (pair: [Currency, Currency]) =>
    [FeeAmount.LOWEST, FeeAmount.LOW, FeeAmount.MEDIUM, FeeAmount.HIGH].map((fee) => getV3PoolMeta([...pair, fee])),
  ([currencyA, currencyB]) => {
    if (currencyA.wrapped.equals(currencyB.wrapped)) {
      return [currencyA.chainId, currencyA.wrapped.address].join('_')
    }
    const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
      ? [currencyA.wrapped, currencyB.wrapped]
      : [currencyB.wrapped, currencyA.wrapped]
    return [token0.chainId, token0.address, token1.address].join('_')
  },
)

interface V3PoolSubgraphResult {
  id: string
  liquidity: string
  sqrtPrice: string
  tick: string
  feeTier: string
  feeProtocol: string
  totalValueLockedUSD: string
}

const queryV3Pools = gql`
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

export const getV3PoolSubgraph = subgraphPoolProviderFactory<V3PoolMeta, V3PoolWithTvl>({
  id: 'V3',
  getPoolMetas: getV3PoolMetas,
  getPoolsFromSubgraph: async ({ addresses, getPoolMetaByAddress, client }) => {
    const { pools: poolsFromSubgraph } = await client.request<{ pools: V3PoolSubgraphResult[] }>(queryV3Pools, {
      pageSize: 1000,
      poolAddrs: addresses,
    })

    return poolsFromSubgraph.map(({ id, liquidity, sqrtPrice, tick, totalValueLockedUSD, feeProtocol }) => {
      const meta = getPoolMetaByAddress(id as Address)
      if (!meta) {
        return null
      }

      const { fee, currencyA, currencyB, address } = meta
      const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
        ? [currencyA, currencyB]
        : [currencyB, currencyA]
      const [token0ProtocolFee, token1ProtocolFee] = parseProtocolFees(feeProtocol)
      return {
        type: PoolType.V3 as const,
        fee,
        token0,
        token1,
        liquidity: BigInt(liquidity),
        sqrtRatioX96: BigInt(sqrtPrice),
        tick: Number(tick),
        address,
        tvlUSD: BigInt(Number.parseInt(totalValueLockedUSD)),
        token0ProtocolFee,
        token1ProtocolFee,
      }
    })
  },
})

interface V2PoolSubgraphResult {
  id: string
  reserveUSD: string
  reserve0: string
  reserve1: string
}

const queryV2Pools = gql`
  query getPools($pageSize: Int!, $poolAddrs: [ID!]) {
    pairs(first: $pageSize, where: { id_in: $poolAddrs }) {
      id
      reserve0
      reserve1
      reserveUSD
    }
  }
`

export const getV2PoolSubgraph = subgraphPoolProviderFactory<PoolMeta, V2PoolWithTvl>({
  id: 'V2',
  getPoolMetas: ([currencyA, currencyB]) => [
    {
      currencyA,
      currencyB,
      address: computeV2PoolAddress(currencyA.wrapped, currencyB.wrapped),
    },
  ],
  getPoolsFromSubgraph: async ({ addresses, getPoolMetaByAddress, client }) => {
    const { pairs: poolsFromSubgraph } = await client.request<{ pairs: V2PoolSubgraphResult[] }>(queryV2Pools, {
      pageSize: 1000,
      poolAddrs: addresses,
    })

    return poolsFromSubgraph.map(({ id, reserveUSD, reserve0, reserve1 }) => {
      const meta = getPoolMetaByAddress(id as Address)
      if (!meta) {
        return null
      }

      const { currencyA, currencyB, address } = meta
      const [token0, token1] = currencyA.wrapped.sortsBefore(currencyB.wrapped)
        ? [currencyA, currencyB]
        : [currencyB, currencyA]
      const reserve0Amount = tryParseAmount(reserve0, token0)
      const reserve1Amount = tryParseAmount(reserve1, token1)
      if (!reserve0Amount || !reserve1Amount) {
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
  },
})

interface AllPoolsFactoryParams<P extends WithTvl> {
  // Function identifier
  id: string

  // Page number starts from 0
  getPoolsFromSubgraph: (params: {
    lastId: string
    pageSize: number
    client: GraphQLClient
    chainId: number
  }) => Promise<P[]>

  getPoolId: (p: P) => string
}

function subgraphAllPoolsQueryFactory<P extends WithTvl>({
  getPoolsFromSubgraph,
  getPoolId,
}: AllPoolsFactoryParams<P>) {
  return async function getAllPools({
    provider,
    chainId,
    pageSize = 1000,
  }: {
    chainId?: ChainId
    provider?: SubgraphProvider
    pageSize?: number
  }): Promise<P[]> {
    if (!provider || !chainId) {
      throw new Error('No valid subgraph data provider')
    }
    const client = provider({ chainId })

    if (!client) {
      throw new Error(`No subgraph client found for chainId ${chainId}`)
    }

    let hasMorePools = true
    let lastId = ''
    let pools: P[] = []
    while (hasMorePools) {
      // eslint-disable-next-line no-await-in-loop
      const poolsAtCurrentPage = await getPoolsFromSubgraph({ client, lastId, pageSize, chainId })
      if (poolsAtCurrentPage.length < pageSize) {
        hasMorePools = false
        pools = [...pools, ...poolsAtCurrentPage]
        break
      }
      lastId = getPoolId(poolsAtCurrentPage[poolsAtCurrentPage.length - 1])
      pools = [...pools, ...poolsAtCurrentPage]
    }
    return pools
  }
}

const queryAllV3Pools = gql`
  query getPools($pageSize: Int!, $id: String) {
    pools(first: $pageSize, where: { id_gt: $id }) {
      id
      tick
      token0 {
        symbol
        id
        decimals
      }
      token1 {
        symbol
        id
        decimals
      }
      sqrtPrice
      feeTier
      liquidity
      feeProtocol
      totalValueLockedUSD
    }
  }
`

interface TokenFromSubgraph {
  symbol: string
  id: string
  decimals: string
}

export interface V3DetailedPoolSubgraphResult extends V3PoolSubgraphResult {
  token0: TokenFromSubgraph
  token1: TokenFromSubgraph
}

export const getAllV3PoolsFromSubgraph = subgraphAllPoolsQueryFactory<V3PoolWithTvl>({
  id: 'getAllV3PoolsFromSubgraph',
  getPoolsFromSubgraph: async ({ lastId, pageSize, client, chainId }) => {
    const { pools: poolsFromSubgraph } = await client.request<{ pools: V3DetailedPoolSubgraphResult[] }>(
      queryAllV3Pools,
      {
        pageSize,
        id: lastId,
      },
    )

    return poolsFromSubgraph.map(
      ({ id, liquidity, sqrtPrice, tick, totalValueLockedUSD, feeProtocol, token0, token1, feeTier }) => {
        const [token0ProtocolFee, token1ProtocolFee] = parseProtocolFees(feeProtocol)
        return {
          type: PoolType.V3 as const,
          fee: Number(feeTier),
          token0: new Token(chainId, getAddress(token0.id), Number(token0.decimals), token0.symbol),
          token1: new Token(chainId, getAddress(token1.id), Number(token1.decimals), token1.symbol),
          liquidity: BigInt(liquidity),
          sqrtRatioX96: BigInt(sqrtPrice),
          tick: Number(tick),
          address: getAddress(id),
          tvlUSD: BigInt(Number.parseInt(totalValueLockedUSD)),
          token0ProtocolFee,
          token1ProtocolFee,
        }
      },
    )
  },
  getPoolId: (p) => p.address,
})
