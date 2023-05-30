import { BigintIsh, Currency } from '@pancakeswap/sdk'

import { SubgraphProvider, V3PoolWithTvl } from '../../types'
import { withFallback } from '../../../utils/withFallback'
import { getV3PoolSubgraph } from './subgraphPoolProviders'
import { getPairCombinations } from '../../functions'
import { v3PoolTvlSelector } from './poolTvlSelectors'

interface Params {
  currencyA?: Currency
  currencyB?: Currency

  // V3 subgraph provider
  subgraphProvider?: SubgraphProvider
  blockNumber?: BigintIsh

  // Only use this param if we want to specify pairs we want to get
  pairs?: [Currency, Currency][]
}

export async function getV3CandidatePools(params: Params) {
  const { subgraphProvider, currencyA, currencyB, pairs: providedPairs } = params
  const pairs = providedPairs || getPairCombinations(currencyA, currencyB)

  const getPools = withFallback<V3PoolWithTvl[]>([
    {
      asyncFn: () => getV3PoolSubgraph({ provider: subgraphProvider, pairs }),
      timeout: 3000,
    },
    // TODO fallback to ipfs
  ])

  const pools = await getPools()
  return v3PoolTvlSelector(currencyA, currencyB, pools)
}
