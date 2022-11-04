import { Pair } from '@pancakeswap/sdk'

export function includesPair(pairs: Pair[], pair: Pair) {
  return pairs.some((p) => isSamePair(p, pair))
}

export function isSamePair(one: Pair, another: Pair) {
  return another.involvesToken(one.token0) && another.involvesToken(one.token1)
}
