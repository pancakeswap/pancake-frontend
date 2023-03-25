import { Currency, JSBI, Price, Trade } from '@pancakeswap/aptos-swap-sdk'
import maxBy from 'lodash/maxBy'
import { L0_USDC, CAKE, CE_USDC, WH_USDC } from 'config/coins'
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
  const defaultStable = useMemo(() => L0_USDC[chainId], [chainId])
  const stableTokens = useMemo(() => [L0_USDC[chainId], WH_USDC[chainId], CE_USDC[chainId]], [chainId])

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [chainId && wrapped && wnative?.equals(wrapped) ? undefined : currency, chainId ? wnative : undefined],
      [chainId ? wnative : undefined, defaultStable],
    ],
    [wnative, defaultStable, chainId, currency, wrapped],
  )
  const [[nativePairState, nativePair], [stableNativePairState, stableNativePair]] = usePairs(tokenPairs)

  const stablePairs = usePairs(
    useMemo(
      () =>
        stableTokens.map((stableToken) => {
          return [stableToken && wrapped?.equals(stableToken) ? undefined : wrapped, stableToken]
        }),
      [stableTokens, wrapped],
    ),
  )

  return useMemo(() => {
    if (!currency || !wrapped || !chainId || !wnative || !stableTokens.filter(Boolean).length) {
      return undefined
    }

    const bestStablePair = maxBy(
      stablePairs
        .filter(
          ([stablePairState, stablePair]) =>
            stablePair &&
            stablePairState === PairState.EXISTS &&
            stablePair.reserve0.greaterThan('0') &&
            stablePair.reserve1.greaterThan('0'),
        )
        .map(([, stablePair]) => stablePair),
      (stablePair) => {
        const stablePairToken = stableTokens.find((stableToken) => stablePair?.involvesToken(stableToken))
        const stablePairTokenAmount = stablePairToken
          ? stablePair?.reserveOf(stablePairToken).quotient.toString()
          : null
        if (stablePairToken && stablePairTokenAmount) {
          return parseInt(stablePairTokenAmount)
        }
        return 0
      },
    )

    // handle wbnb/bnb
    if (wrapped.equals(wnative)) {
      if (bestStablePair) {
        const price = bestStablePair.priceOf(wnative)
        const stablePairToken = stableTokens.find((stableToken) => bestStablePair.involvesToken(stableToken))
        return new Price(currency, stablePairToken, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle stable
    if (wrapped.equals(defaultStable)) {
      return new Price(defaultStable, defaultStable, '1', '1')
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
      nativePairNativeAmount && bestStablePair && isStableNativePairExist
        ? stableNativePair.priceOf(wnative).quote(nativePairNativeAmount).quotient
        : JSBI.BigInt(0)

    // all other tokens
    // first try the stable pair
    if (bestStablePair) {
      const stablePairToken = stableTokens.find((stableToken) => bestStablePair.involvesToken(stableToken))
      if (bestStablePair.reserveOf(stablePairToken).greaterThan(nativePairNativeStableValue)) {
        const price = bestStablePair.priceOf(wrapped)
        return new Price(currency, stablePairToken, price.denominator, price.numerator)
      }
    }
    if (isNativePairExist && isStableNativePairExist) {
      if (
        stableNativePair.reserveOf(defaultStable).greaterThan('0') &&
        nativePair.reserveOf(wnative).greaterThan('0')
      ) {
        const nativeStablePrice = stableNativePair.priceOf(defaultStable)
        const currencyNativePrice = nativePair.priceOf(wnative)
        const stablePrice = nativeStablePrice.multiply(currencyNativePrice).invert()
        return new Price(currency, defaultStable, stablePrice.denominator, stablePrice.numerator)
      }
    }

    return undefined
  }, [
    currency,
    wrapped,
    chainId,
    wnative,
    defaultStable,
    nativePair,
    stablePairs,
    stableTokens,
    stableNativePair,
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
