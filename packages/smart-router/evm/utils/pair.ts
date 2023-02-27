import { Currency } from '@pancakeswap/sdk'

import { Pair, StableSwapPair } from '../types'

export function involvesToken(pair: Pair, token: Currency) {
  const { token0, token1 } = pair
  return token0.wrapped.equals(token.wrapped) || token1.wrapped.equals(token.wrapped)
}

export function includesPair(pairs: Pair[], pair: Pair) {
  return pairs.some((p) => isSamePair(p, pair))
}

export function isSamePair(one: Pair, another: Pair) {
  return involvesToken(another, one.token0) && involvesToken(another, one.token1)
}

export function getOutputToken(pair: Pair, inputToken: Currency) {
  return inputToken.wrapped.equals(pair.token0.wrapped) ? pair.token1 : pair.token0
}

export function isStableSwapPair(pair: Pair): pair is StableSwapPair {
  return !!(pair as StableSwapPair).stableSwapAddress
}
