import _uniqBy from 'lodash/uniqBy'
import { useMemo } from 'react'

import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { CE_USDC, L0_USDC, WH_USDC } from 'config/coins'
import { usePairs } from 'hooks/usePairs'

import useNativeCurrency from '../../../hooks/useNativeCurrency'
import getCurrencyPrice from '../../../utils/getCurrencyPrice'
import splitTypeTag from '../../../utils/splitTypeTag'
import getTokenByAddress from '../utils/getTokenByAddress'

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

  const [stableNativePairInfo] = usePairs(
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

  return useMemo(() => {
    const prices = {}

    poolsCoins
      .map((coin) => {
        const stablePairsInfo = pairsInfo.filter(
          ([, pair]) =>
            pair && pair.involvesToken(coin) && stableTokens.some((stableToken) => pair.involvesToken(stableToken)),
        )
        const nativePairInfo = pairsInfo.filter(
          ([, pair]) => pair && pair.involvesToken(coin) && pair.involvesToken(wnative),
        )[0]
        return getCurrencyPrice(
          coin,
          usdcCoin,
          wnative,
          stableTokens,
          nativePairInfo,
          stableNativePairInfo,
          stablePairsInfo,
        )
      })
      .forEach((price) => {
        if (price) {
          prices[price.baseCurrency.wrapped.address] = parseFloat(price.toFixed(18))
        }
      })
    return prices
  }, [poolsCoins, pairsInfo, stableNativePairInfo, stableTokens, usdcCoin, wnative])
}
