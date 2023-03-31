import { ChainId, Currency } from '@pancakeswap/sdk'

import { ADDITIONAL_BASES, BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from '../../constants'
import { wrappedCurrency } from '../../utils/currency'
import { flatMap } from '../../utils/flatMap'
import { isCurrenciesSameChain } from '../utils'

export const getPairCombinations = (currencyA?: Currency, currencyB?: Currency): [Currency, Currency][] => {
  // eslint-disable-next-line prefer-destructuring
  const chainId: ChainId | undefined = currencyA?.chainId
  if (!chainId || !currencyA || !currencyB || !isCurrenciesSameChain(currencyA, currencyB)) {
    return []
  }

  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined]

  if (!tokenA || !tokenB) {
    return []
  }

  const common = BASES_TO_CHECK_TRADES_AGAINST[chainId] ?? []
  const additionalA = tokenA ? ADDITIONAL_BASES[chainId]?.[tokenA.address] ?? [] : []
  const additionalB = tokenB ? ADDITIONAL_BASES[chainId]?.[tokenB.address] ?? [] : []

  const bases: Currency[] = [...common, ...additionalA, ...additionalB]

  const basePairs: [Currency, Currency][] = flatMap(bases, (base): [Currency, Currency][] =>
    bases.map((otherBase) => [base, otherBase]),
  )

  return [
    // the direct pair
    [tokenA, tokenB],
    // token A against all bases
    ...bases.map((base): [Currency, Currency] => [tokenA, base]),
    // token B against all bases
    ...bases.map((base): [Currency, Currency] => [tokenB, base]),
    // each base against all bases
    ...basePairs,
  ]
    .filter((tokens): tokens is [Currency, Currency] => Boolean(tokens[0] && tokens[1]))
    .filter(([t0, t1]) => !t0.equals(t1))
    .filter(([tokenA_, tokenB_]) => {
      if (!chainId) return true
      const customBases = CUSTOM_BASES[chainId]

      const customBasesA: Currency[] | undefined = customBases?.[tokenA_.wrapped.address]
      const customBasesB: Currency[] | undefined = customBases?.[tokenB_.wrapped.address]

      if (!customBasesA && !customBasesB) return true

      if (customBasesA && !customBasesA.find((base) => tokenB_.equals(base))) return false
      if (customBasesB && !customBasesB.find((base) => tokenA_.equals(base))) return false

      return true
    })
}
