import { BigintIsh, Currency } from '@pancakeswap/sdk'
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

const getV3PoolTvl = memoize(
  (pools: V3PoolWithTvl[], poolAddress: Address) => {
    const poolWithTvl = pools.find((p) => p.address === poolAddress)
    return poolWithTvl?.tvlUSD || 0n
  },
  (_, poolAddress) => poolAddress,
)

// Get pools from onchain and use the tvl data from subgraph as reference
// The reason we do this is the data from subgraph might delay
export async function getV3PoolsWithTvlFromOnChain(params: Params): Promise<V3PoolWithTvl[]> {
  const { subgraphProvider, currencyA, currencyB, pairs: providedPairs, onChainProvider, blockNumber } = params
  const pairs = providedPairs || getPairCombinations(currencyA, currencyB)

  const [fromOnChain, fromSubgraph] = await Promise.allSettled([
    getV3PoolsWithoutTicksOnChain(pairs, onChainProvider, blockNumber),
    getV3PoolSubgraph({ provider: subgraphProvider, pairs }),
  ])

  if (fromOnChain.status === 'fulfilled' && fromSubgraph.status === 'fulfilled') {
    const { value: poolsFromOnChain } = fromOnChain
    const { value: poolsFromSubgraph } = fromSubgraph
    return poolsFromOnChain.map((pool) => {
      const tvlUSD = getV3PoolTvl(poolsFromSubgraph, pool.address)
      return {
        ...pool,
        tvlUSD,
      }
    })
  }

  // Use pools from subgraph if on chain query is not working
  if (fromOnChain.status !== 'fulfilled' && fromSubgraph.status === 'fulfilled') {
    return fromSubgraph.value
  }
  throw new Error(JSON.stringify([fromOnChain, fromSubgraph]))
}

export async function getV3CandidatePools(params: Params) {
  const { currencyA, currencyB } = params
  const getPools = withFallback<V3PoolWithTvl[]>([
    {
      asyncFn: () => getV3PoolsWithTvlFromOnChain(params),
    },
    // TODO fallback to ipfs or other storage
  ])

  const pools = await getPools()
  return v3PoolTvlSelector(currencyA, currencyB, pools)
}
