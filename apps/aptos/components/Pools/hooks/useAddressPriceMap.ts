import _uniqBy from 'lodash/uniqBy'
import maxBy from 'lodash/maxBy'
import { useMemo } from 'react'

import { PairState, usePairs } from 'hooks/usePairs'
import { CE_USDC, L0_USDC, WH_USDC } from 'config/coins'
import { Currency, JSBI, Pair, Price } from '@pancakeswap/aptos-swap-sdk'

import splitTypeTag from '../../../utils/splitTypeTag'
import getTokenByAddress from '../utils/getTokenByAddress'
import useNativeCurrency from '../../../hooks/useNativeCurrency'

function getPoolsCoins({ pools, chainId }): Currency[] {
  if (!pools?.length) return []

  const coinAddresses: string[] = pools.reduce((list, resource) => {
    const [stakingAddress, earningAddress] = splitTypeTag(resource.type)

    const updatedList = list

    if (!updatedList.includes(stakingAddress)) {
      updatedList.push(stakingAddress)
    }

    if (!updatedList.includes(earningAddress)) {
      updatedList.push(earningAddress)
    }

    return updatedList
  }, [])

  return _uniqBy(
    coinAddresses.map((address) => getTokenByAddress({ chainId, address })).filter(Boolean) as Currency[],
    'address',
  )
}

export default function useAddressPriceMap({ pools, chainId }) {
  const native = useNativeCurrency(chainId)
  const wnative = native.wrapped
  const stableTokens = useMemo(() => [L0_USDC[chainId], WH_USDC[chainId], CE_USDC[chainId]], [chainId])
  const usdcCoin = L0_USDC[chainId]

  const [[stableNativePairState, stableNativePair]] = usePairs(
    useMemo(() => [[chainId ? wnative : undefined, usdcCoin]], [wnative, usdcCoin, chainId]),
  )
  const poolsCoins = useMemo(() => getPoolsCoins({ pools, chainId }), [pools, chainId])

  const poolsCoinsNativePairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () =>
      poolsCoins.map((coin) => {
        return [
          chainId && coin?.wrapped && wnative?.equals(coin.wrapped) ? undefined : coin,
          chainId ? wnative : undefined,
        ]
      }),
    [wnative, poolsCoins, chainId],
  )
  const poolsCoinsStablePairs = useMemo(
    () =>
      poolsCoins
        .map((coin) => {
          const result: [Currency | undefined, Currency | undefined][] = stableTokens.map((stableToken) => {
            return [stableToken && coin?.wrapped?.equals(stableToken) ? undefined : coin.wrapped, stableToken]
          })
          return result
        })
        .flat(),
    [poolsCoins, stableTokens],
  )
  const pairsInfo = usePairs(
    useMemo(() => [...poolsCoinsNativePairs, ...poolsCoinsStablePairs], [poolsCoinsNativePairs, poolsCoinsStablePairs]),
  )
  const availablePairs = useMemo(
    () =>
      _uniqBy(
        pairsInfo.filter(([status]) => status === PairState.EXISTS).map(([, pair]) => pair as Pair),
        'liquidityToken.address',
      ),
    [pairsInfo],
  )

  return useMemo(() => {
    const prices = {}

    poolsCoins
      .map((coin) => {
        const stablePairs = availablePairs.filter(
          (pair) => pair.involvesToken(coin) && stableTokens.some((stableToken) => pair.involvesToken(stableToken)),
        )
        const nativePair = availablePairs.filter((pair) => pair.involvesToken(coin) && pair.involvesToken(wnative))[0]

        const bestStablePair = maxBy(
          stablePairs.filter(
            (stablePair) => stablePair && stablePair.reserve0.greaterThan('0') && stablePair.reserve1.greaterThan('0'),
          ),
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
        if (coin.wrapped.equals(wnative)) {
          if (bestStablePair) {
            const price = bestStablePair.priceOf(wnative)
            const stablePairToken = stableTokens.find((stableToken) => bestStablePair.involvesToken(stableToken))
            return new Price(coin, stablePairToken, price.denominator, price.numerator)
          }
          return undefined
        }
        // handle stable
        if (coin.wrapped.equals(usdcCoin)) {
          return new Price(usdcCoin, usdcCoin, '1', '1')
        }

        const isNativePairExist =
          nativePair && nativePair.reserve0.greaterThan('0') && nativePair.reserve1.greaterThan('0')
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
            const price = bestStablePair.priceOf(coin.wrapped)
            return new Price(coin, stablePairToken, price.denominator, price.numerator)
          }
        }
        if (isNativePairExist && isStableNativePairExist) {
          if (stableNativePair.reserveOf(usdcCoin).greaterThan('0') && nativePair.reserveOf(wnative).greaterThan('0')) {
            const nativeStablePrice = stableNativePair.priceOf(usdcCoin)
            const currencyNativePrice = nativePair.priceOf(wnative)
            const stablePrice = nativeStablePrice.multiply(currencyNativePrice).invert()
            return new Price(coin, usdcCoin, stablePrice.denominator, stablePrice.numerator)
          }
        }
        return undefined
      })
      .forEach((price) => {
        if (price) {
          prices[price.baseCurrency.wrapped.address] = parseFloat(price.toFixed())
        }
      })
    return prices
  }, [availablePairs, poolsCoins, stableNativePair, stableNativePairState, stableTokens, usdcCoin, wnative])
}
