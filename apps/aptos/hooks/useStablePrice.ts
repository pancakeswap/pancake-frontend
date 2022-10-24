import { Currency, JSBI, Price } from '@pancakeswap/aptos-swap-sdk'
import { USDC } from 'config/coins'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import useSWR from 'swr'
import useNativeCurrency from './useNativeCurrency'
import { PairState, usePairs } from './usePairs'

/**
 * Returns the price in stable of the input currency
 * @param currency currency to compute the stable price of
 */
export default function useStablePrice(currency?: Currency): Price<Currency, Currency> | undefined {
  const { chainId } = useActiveWeb3React()
  const native = useNativeCurrency()
  const wrapped = currency?.wrapped
  const wnative = native.wrapped
  const stable = USDC[chainId]

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && wnative?.equals(wrapped) ? undefined : currency, chainId ? wnative : undefined],
      [stable && wrapped?.equals(stable) ? undefined : wrapped, stable],
      [chainId ? wnative : undefined, stable],
    ],
    [wnative, stable, chainId, currency, wrapped],
  )
  const [[nativePairState, nativePair], [stablePairState, stablePair], [stableNativePairState, stableNativePair]] =
    usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId || !wnative || !stable) {
      return undefined
    }

    const isStablePairExist =
      stablePair &&
      stablePairState === PairState.EXISTS &&
      stablePair.reserve0.greaterThan('0') &&
      stablePair.reserve1.greaterThan('0')

    // handle wbnb/bnb
    if (wrapped.equals(wnative)) {
      if (isStablePairExist) {
        const price = stablePair.priceOf(wnative)
        return new Price(currency, stable, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle stable
    if (wrapped.equals(stable)) {
      return new Price(stable, stable, '1', '1')
    }

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
    const nativePairNativeStableValue: JSBI =
      nativePairNativeAmount && isStablePairExist && isStableNativePairExist
        ? stableNativePair.priceOf(wnative).quote(nativePairNativeAmount).quotient
        : JSBI.BigInt(0)

    // all other tokens
    // first try the stable pair
    if (isStablePairExist && stablePair.reserveOf(stable).greaterThan(nativePairNativeStableValue)) {
      const price = stablePair.priceOf(wrapped)
      return new Price(currency, stable, price.denominator, price.numerator)
    }
    if (isNativePairExist && isStableNativePairExist) {
      if (stableNativePair.reserveOf(stable).greaterThan('0') && nativePair.reserveOf(wnative).greaterThan('0')) {
        const nativeStablePrice = stableNativePair.priceOf(stable)
        const currencyNativePrice = nativePair.priceOf(wnative)
        const stablePrice = nativeStablePrice.multiply(currencyNativePrice).invert()
        return new Price(currency, stable, stablePrice.denominator, stablePrice.numerator)
      }
    }

    return undefined
  }, [
    currency,
    wrapped,
    chainId,
    wnative,
    stable,
    nativePair,
    stableNativePair,
    stablePairState,
    stablePair,
    nativePairState,
    stableNativePairState,
  ])
}

export const useStableCakeAmount = (_amount: number): number | undefined => {
  // const cakeBusdPrice = useCakeBusdPrice()
  // if (cakeBusdPrice) {
  //   return multiplyPriceByAmount(cakeBusdPrice, amount)
  // }
  return undefined
}

export const useCakePrice = () => {
  return useSWR(
    ['cake-usd-price'],
    async () => {
      const cake = await (await fetch('https://farms.pancake-swap.workers.dev/price/cake')).json()
      return cake.price
    },
    {
      refreshInterval: 1_000 * 10,
    },
  )
}
