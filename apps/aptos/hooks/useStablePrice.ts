import { Currency, JSBI, Price, Trade } from '@pancakeswap/aptos-swap-sdk'
import { L0_USDC, CAKE } from 'config/coins'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import BigNumber from 'bignumber.js'
import { useAllCommonPairs } from 'hooks/Trades'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import useNativeCurrency from './useNativeCurrency'
import { PairState, usePairs } from './usePairs'

/**
 * Returns the price in stable of the input currency
 * @param currency currency to compute the stable price of
 */
export default function useStablePrice(currency?: Currency): Price<Currency, Currency> | undefined {
  const { chainId: webChainId } = useActiveWeb3React()

  const chainId = currency?.chainId || webChainId

  const native = useNativeCurrency(chainId)
  const wrapped = currency?.wrapped
  const wnative = native.wrapped
  const stable = L0_USDC[chainId]

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
  return useSWRImmutable(
    ['cake-usd-price'],
    async () => {
      const cake = await (await fetch('https://farms-api.pancakeswap.com/price/cake')).json()
      return cake.price
    },
    {
      refreshInterval: 1_000 * 10,
    },
  )
}

export const usePriceCakeUsdc = () => {
  const { chainId } = useActiveWeb3React()
  const cakePrice = useTokenUsdcPrice(CAKE[chainId])
  return useMemo(() => (cakePrice ? new BigNumber(cakePrice) : BIG_ZERO), [cakePrice])
}

export const useTokenUsdcPrice = (currency?: Currency): BigNumber => {
  const { chainId } = useActiveWeb3React()
  const USDC = L0_USDC[currency?.chainId || chainId]

  const allowedPairs = useAllCommonPairs(currency, USDC)
  const tokenInAmount = tryParseAmount('1', currency)

  if (!tokenInAmount || !allowedPairs?.length) {
    return BIG_ZERO
  }

  const trade = Trade.bestTradeExactIn(allowedPairs, tokenInAmount, USDC, { maxHops: 3, maxNumResults: 1 })[0]
  const usdcAmount = trade?.outputAmount?.toSignificant() || '0'

  return new BigNumber(usdcAmount)
}
