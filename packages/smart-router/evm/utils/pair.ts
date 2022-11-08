import { Currency, Pair } from '@pancakeswap/sdk'

export function includesPair(pairs: Pair[], pair: Pair) {
  return pairs.some((p) => isSamePair(p, pair))
}

export function isSamePair(one: Pair, another: Pair) {
  return another.involvesToken(one.token0) && another.involvesToken(one.token1)
}

export function getOutputToken(pair: Pair, inputToken: Currency) {
  return inputToken.equals(pair.token0) ? pair.token1 : pair.token0
}
