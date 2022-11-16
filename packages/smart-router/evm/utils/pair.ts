import { Currency, Pair } from '@pancakeswap/sdk'
import { StableSwapPair } from '../types'

export function includesPair(pairs: Pair[], pair: Pair) {
  return pairs.some((p) => isSamePair(p, pair))
}

export function isSamePair(one: Pair | StableSwapPair, another: Pair | StableSwapPair) {
  return another.involvesToken(one.token0) && another.involvesToken(one.token1)
}

export function getOutputToken(pair: Pair | StableSwapPair, inputToken: Currency) {
  return inputToken.equals(pair.token0) ? pair.token1 : pair.token0
}
