import { BigintIsh, Currency } from '@pancakeswap/sdk'

import { getPairCombinations } from '../../functions'
import { OnChainProvider } from '../../types'
import { getStablePoolsOnChain } from './onChainPoolProviders'

interface Params {
  currencyA?: Currency
  currencyB?: Currency
  onChainProvider?: OnChainProvider
  blockNumber?: BigintIsh

  // Only use this param if we want to specify pairs we want to get
  pairs?: [Currency, Currency][]
}

export async function getStableCandidatePools(params: Params) {
  const { onChainProvider, currencyA, currencyB, pairs: providedPairs, blockNumber } = params
  const pairs = providedPairs || (await getPairCombinations(currencyA, currencyB))
  return getStablePoolsOnChain(pairs, onChainProvider, blockNumber)
}
