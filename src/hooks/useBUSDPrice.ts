import { Currency, JSBI, Price, WNATIVE, ChainId } from '@pancakeswap/sdk'
import { CAKE, BUSD } from 'config/constants/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { multiplyPriceByAmount } from 'utils/prices'
import { PairState, usePairs } from './usePairs'

/**
 * Returns the price in BUSD of the input currency
 * @param currency currency to compute the BUSD price of
 */
export default function useBUSDPrice(currency?: Currency): Price<Currency, Currency> | undefined {
  const { chainId } = useActiveWeb3React()
  const wrapped = currency?.wrapped
  const wnative = WNATIVE[chainId] || WNATIVE[ChainId.BSC]
  const busd = BUSD[chainId] || BUSD[ChainId.BSC]

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && wnative?.equals(wrapped) ? undefined : currency, chainId ? wnative : undefined],
      [wrapped?.equals(busd) ? undefined : wrapped, busd],
      [chainId ? wnative : undefined, busd],
    ],
    [wnative, busd, chainId, currency, wrapped],
  )
  const [[bnbPairState, bnbPair], [busdPairState, busdPair], [busdBnbPairState, busdBnbPair]] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle wbnb/bnb
    if (wrapped.equals(wnative)) {
      if (busdPair) {
        const price = busdPair.priceOf(wnative)
        return new Price(currency, busd, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle busd
    if (wrapped.equals(busd)) {
      return new Price(busd, busd, '1', '1')
    }

    const bnbPairBNBAmount = bnbPair?.reserveOf(wnative)
    const bnbPairBNBBUSDValue: JSBI =
      bnbPairBNBAmount && busdBnbPair ? busdBnbPair.priceOf(wnative).quote(bnbPairBNBAmount).quotient : JSBI.BigInt(0)

    // all other tokens
    // first try the busd pair
    if (busdPairState === PairState.EXISTS && busdPair && busdPair.reserveOf(busd).greaterThan(bnbPairBNBBUSDValue)) {
      const price = busdPair.priceOf(wrapped)
      return new Price(currency, busd, price.denominator, price.numerator)
    }
    if (bnbPairState === PairState.EXISTS && bnbPair && busdBnbPairState === PairState.EXISTS && busdBnbPair) {
      if (busdBnbPair.reserveOf(busd).greaterThan('0') && bnbPair.reserveOf(wnative).greaterThan('0')) {
        const bnbBusdPrice = busdBnbPair.priceOf(busd)
        const currencyBnbPrice = bnbPair.priceOf(wnative)
        const busdPrice = bnbBusdPrice.multiply(currencyBnbPrice).invert()
        return new Price(currency, busd, busdPrice.denominator, busdPrice.numerator)
      }
    }

    return undefined
  }, [
    currency,
    wrapped,
    chainId,
    wnative,
    busd,
    bnbPair,
    busdBnbPair,
    busdPairState,
    busdPair,
    bnbPairState,
    busdBnbPairState,
  ])
}

export const useCakeBusdPrice = (): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  const cakeBusdPrice = useBUSDPrice(CAKE[chainId])
  return cakeBusdPrice
}

export const useBUSDCurrencyAmount = (currency?: Currency, amount?: number): number | undefined => {
  const busdPrice = useBUSDPrice(currency)
  if (!amount) {
    return undefined
  }
  if (busdPrice) {
    return multiplyPriceByAmount(busdPrice, amount)
  }
  return undefined
}

export const useBUSDCakeAmount = (amount: number): number | undefined => {
  const cakeBusdPrice = useCakeBusdPrice()
  if (cakeBusdPrice) {
    return multiplyPriceByAmount(cakeBusdPrice, amount)
  }
  return undefined
}

export const useBNBBusdPrice = (): Price<Currency, Currency> | undefined => {
  const { chainId } = useActiveWeb3React()
  const bnbBusdPrice = useBUSDPrice(WNATIVE[chainId])
  return bnbBusdPrice
}
