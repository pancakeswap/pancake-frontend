import { BigintIsh, Currency, ChainId } from '@pancakeswap/sdk'
import memoize from 'lodash/memoize'
import { Address } from 'viem'

import { OnChainProvider, SubgraphProvider, V3PoolWithTvl } from '../../types'
import { withFallback } from '../../../utils/withFallback'
import { getV3PoolSubgraph } from './subgraphPoolProviders'
import { getPairCombinations } from '../../functions'
import { v3PoolTvlSelector } from './poolTvlSelectors'
import { getV3PoolsWithoutTicksOnChain } from './onChainPoolProviders'

interface Params {
  currencyA?: Currency
  currencyB?: Currency

  // V3 subgraph provider
  subgraphProvider?: SubgraphProvider
  onChainProvider?: OnChainProvider
  blockNumber?: BigintIsh

  // Only use this param if we want to specify pairs we want to get
  pairs?: [Currency, Currency][]
}

interface V3PoolTvlReference extends Pick<V3PoolWithTvl, 'address'> {
  tvlUSD: bigint | string
}

const getV3PoolTvl = memoize(
  (pools: V3PoolTvlReference[], poolAddress: Address) => {
    const poolWithTvl = pools.find((p) => p.address === poolAddress)
    return poolWithTvl?.tvlUSD || 0n
  },
  (_, poolAddress) => poolAddress,
)

// Get pools from onchain and use the tvl data from subgraph as reference
// The reason we do this is the data from subgraph might delay
const v3PoolsOnChainProviderFactory = (tvlReferenceProvider: (params: Params) => Promise<V3PoolTvlReference[]>) => {
  return async function getV3PoolsWithTvlFromOnChain(params: Params): Promise<V3PoolWithTvl[]> {
    const { currencyA, currencyB, pairs: providedPairs, onChainProvider, blockNumber } = params
    const pairs = providedPairs || getPairCombinations(currencyA, currencyB)

    const [fromOnChain, tvlReference] = await Promise.allSettled([
      getV3PoolsWithoutTicksOnChain(pairs, onChainProvider, blockNumber),
      tvlReferenceProvider(params),
    ])

    if (fromOnChain.status === 'fulfilled' && tvlReference.status === 'fulfilled') {
      const { value: poolsFromOnChain } = fromOnChain
      const { value: poolTvlReferences } = tvlReference
      return poolsFromOnChain.map((pool) => {
        const tvlUSD = BigInt(getV3PoolTvl(poolTvlReferences, pool.address))
        return {
          ...pool,
          tvlUSD,
        }
      })
    }
    throw new Error(JSON.stringify([fromOnChain, tvlReference]))
  }
}

const getV3PoolsWithTvlFromOnChain = v3PoolsOnChainProviderFactory((params: Params) => {
  const { currencyA, currencyB, pairs: providedPairs, subgraphProvider } = params
  const pairs = providedPairs || getPairCombinations(currencyA, currencyB)
  return getV3PoolSubgraph({ provider: subgraphProvider, pairs })
})

const createFallbackTvlRefGetter = () => {
  const cache = new Map<ChainId, V3PoolTvlReference[]>()
  return async (params: Params) => {
    const { currencyA } = params
    if (!currencyA?.chainId) {
      throw new Error(`Cannot get tvl references at chain ${currencyA?.chainId}`)
    }
    const cached = cache.get(currencyA.chainId)
    if (cached) {
      return cached
    }
    const res = await fetch(`https://routing-api.pancakeswap.com/v0/v3-pools-tvl/${currencyA.chainId}`)
    const refs: V3PoolTvlReference[] = await res.json()
    cache.set(currencyA.chainId, refs)
    return refs
  }
}

const getV3PoolsWithTvlFromOnChainFallback = v3PoolsOnChainProviderFactory(createFallbackTvlRefGetter())

export async function getV3CandidatePools(params: Params) {
  const { currencyA, currencyB, pairs: providedPairs, subgraphProvider } = params
  const pairs = providedPairs || getPairCombinations(currencyA, currencyB)

  const getPools = withFallback([
    // Try get pools from on chain and ref tvl by subgraph
    {
      asyncFn: () => getV3PoolsWithTvlFromOnChain(params),
      timeout: 3000,
    },
    // Fallback to get pools from on chain and ref tvl by subgraph cache
    {
      asyncFn: () => getV3PoolsWithTvlFromOnChainFallback(params),
      timeout: 3000,
    },
    // Fallback to get all pools info from subgraph
    {
      asyncFn: () => getV3PoolSubgraph({ provider: subgraphProvider, pairs }),
    },
  ])

  const pools = await getPools()
  return v3PoolTvlSelector(currencyA, currencyB, pools)
}
