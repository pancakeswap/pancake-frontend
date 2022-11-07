import { Pair } from '@pancakeswap/sdk'

import { StableSwapPair } from './types'

export function createStableSwapPair(pair: Pair, stableSwapAddress = ''): StableSwapPair {
  const newPair = new Pair(pair.reserve0, pair.reserve1)
  ;(newPair as StableSwapPair).stableSwapAddress = stableSwapAddress
  return newPair as StableSwapPair
}

export function isStableSwapPair(pair: Pair): pair is StableSwapPair {
  return !!(pair as StableSwapPair).stableSwapAddress
}
