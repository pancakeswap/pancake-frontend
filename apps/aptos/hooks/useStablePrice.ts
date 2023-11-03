import { Currency, Price, Trade } from '@pancakeswap/aptos-swap-sdk'
import { L0_USDC, CAKE, CE_USDC, WH_USDC } from 'config/coins'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useAllCommonPairs } from 'hooks/Trades'
import tryParseAmount from '@pancakeswap/utils/tryParseAmount'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { useCakePrice } from './useCakePrice'
import useNativeCurrency from './useNativeCurrency'
import { usePairs } from './usePairs'
import getCurrencyPrice from '../utils/getCurrencyPrice'
import { useActiveChainId } from './useNetwork'

/**
 * Returns the price in stable of the input currency
 * @param currency currency to compute the stable price of
 */
export default function useStablePrice(currency?: Currency): Price<Currency, Currency> | undefined {
  const { chainId: webChainId } = useActiveWeb3React()

  const chainId = currency?.chainId || webChainId

  const native = useNativeCurrency(chainId)
  const wnative = native.wrapped
  const wrapped = currency?.wrapped
  const defaultStable = useMemo(() => L0_USDC[chainId], [chainId])
  const stableTokens = useMemo(() => [L0_USDC[chainId], WH_USDC[chainId], CE_USDC[chainId]], [chainId])

  const [nativePairInfo, stableNativePairInfo] = usePairs(
    useMemo(
      () => [
        [chainId && wrapped && wnative?.equals(wrapped) ? undefined : currency, chainId ? wnative : undefined],
        [chainId ? wnative : undefined, defaultStable],
      ],
      [wnative, defaultStable, chainId, currency, wrapped],
    ),
  )

  const stablePairsInfo = usePairs(
    useMemo(
      () =>
        stableTokens.map((stableToken) => {
          return [stableToken && wrapped?.equals(stableToken) ? undefined : wrapped, stableToken]
        }),
      [stableTokens, wrapped],
    ),
  )

  return useMemo(() => {
    return getCurrencyPrice(
      currency,
      defaultStable,
      wnative,
      stableTokens,
      nativePairInfo,
      stableNativePairInfo,
      stablePairsInfo,
    )
  }, [currency, defaultStable, nativePairInfo, stableNativePairInfo, stablePairsInfo, stableTokens, wnative])
}

export const useStableCakeAmount = (_amount: number): number | undefined => {
  // const cakeBusdPrice = useCakeBusdPrice()
  // if (cakeBusdPrice) {
  //   return multiplyPriceByAmount(cakeBusdPrice, amount)
  // }
  return undefined
}

export { useCakePrice }

export const usePriceCakeUsdc = () => {
  const chainId = useActiveChainId()
  const cakePrice = useTokenUsdcPrice(CAKE[chainId])
  return useMemo(() => (cakePrice ? new BigNumber(cakePrice) : BIG_ZERO), [cakePrice])
}

export const useTokenUsdcPrice = (currency?: Currency): BigNumber => {
  const chainId = useActiveChainId()
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
