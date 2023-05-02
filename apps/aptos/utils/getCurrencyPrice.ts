import { Currency, Pair, Price } from '@pancakeswap/aptos-swap-sdk'
import maxBy from 'lodash/maxBy'
import _uniqBy from 'lodash/uniqBy'
import { PairState } from '../hooks/usePairs'

export default function getCurrencyPrice(
  currency: Currency | undefined,
  defaultStable: Currency,
  wnative: Currency,
  stableTokens: Currency[],
  nativePairInfo: [PairState, Pair | null] | undefined,
  stableNativePairInfo: [PairState, Pair | null] | undefined,
  stablePairsInfo: [PairState, Pair | null][],
): Price<Currency, Currency> | undefined {
  if (!currency || !currency.wrapped || !defaultStable || !wnative || !stableTokens.filter(Boolean).length) {
    return undefined
  }

  const bestStablePair = maxBy(
    _uniqBy(
      stablePairsInfo.filter(
        ([stablePairState, stablePair]) =>
          stablePair &&
          stablePairState === PairState.EXISTS &&
          stablePair.reserve0.greaterThan('0') &&
          stablePair.reserve1.greaterThan('0'),
      ),
      'liquidityToken.address',
    ).map(([, stablePair]) => stablePair),
    (stablePair) => {
      const stablePairToken = stableTokens.find((stableToken) => stablePair?.involvesToken(stableToken))
      const stablePairTokenAmount = stablePairToken ? stablePair?.reserveOf(stablePairToken).quotient.toString() : null
      if (stablePairToken && stablePairTokenAmount) {
        return parseInt(stablePairTokenAmount)
      }
      return 0
    },
  )

  // handle wbnb/bnb
  if (currency.wrapped.equals(wnative)) {
    if (bestStablePair) {
      const price = bestStablePair.priceOf(wnative)
      const stablePairToken = stableTokens.find((stableToken) => bestStablePair.involvesToken(stableToken))
      if (stablePairToken) return new Price(currency, stablePairToken, price.denominator, price.numerator)
    }
    return undefined
  }
  // handle stable
  if (currency.wrapped.equals(defaultStable)) {
    return new Price(defaultStable, defaultStable, '1', '1')
  }

  const [nativePairState, nativePair] = nativePairInfo || []
  const [stableNativePairState, stableNativePair] = stableNativePairInfo || []
  const isNativePairExist =
    nativePair &&
    nativePairState === PairState.EXISTS &&
    nativePair.reserve0.greaterThan('0') &&
    nativePair.reserve1.greaterThan('0')
  const isStableNativePairExist =
    stableNativePair &&
    stableNativePairState === PairState.EXISTS &&
    stableNativePair.reserve0.greaterThan('0') &&
    stableNativePair.reserve1.greaterThan('0')

  const nativePairNativeAmount = isNativePairExist && nativePair?.reserveOf(wnative)
  const nativePairNativeStableValue: bigint =
    nativePairNativeAmount && bestStablePair && isStableNativePairExist
      ? stableNativePair.priceOf(wnative).quote(nativePairNativeAmount).quotient
      : 0n

  // all other tokens
  // first try the stable pair
  if (bestStablePair) {
    const stablePairToken = stableTokens.find((stableToken) => bestStablePair.involvesToken(stableToken))
    if (stablePairToken && bestStablePair.reserveOf(stablePairToken).greaterThan(nativePairNativeStableValue)) {
      const price = bestStablePair.priceOf(currency.wrapped)
      return new Price(currency, stablePairToken, price.denominator, price.numerator)
    }
  }
  if (isNativePairExist && isStableNativePairExist) {
    if (stableNativePair.reserveOf(defaultStable).greaterThan('0') && nativePair.reserveOf(wnative).greaterThan('0')) {
      const nativeStablePrice = stableNativePair.priceOf(defaultStable)
      const currencyNativePrice = nativePair.priceOf(wnative)
      const stablePrice = nativeStablePrice.multiply(currencyNativePrice).invert()
      return new Price(currency, defaultStable, stablePrice.denominator, stablePrice.numerator)
    }
  }
  return undefined
}
