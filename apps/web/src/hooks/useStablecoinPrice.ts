import { ChainId } from '@pancakeswap/chains'
import { Currency, CurrencyAmount, Price, TradeType } from '@pancakeswap/sdk'
import { SmartRouterTrade } from '@pancakeswap/smart-router'
import { CAKE, STABLE_COIN } from '@pancakeswap/tokens'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import { warningSeverity } from 'utils/exchange'
import { multiplyPriceByAmount } from 'utils/prices'
import { computeTradePriceBreakdown } from 'views/Swap/V3Swap/utils/exchange'
import { useActiveChainId } from './useActiveChainId'
import { useBestAMMTrade } from './useBestAMMTrade'
import { useCurrencyUsdPrice } from './useCurrencyUsdPrice'

type UseStablecoinPriceConfig = {
  enabled?: boolean
  hideIfPriceImpactTooHigh?: boolean
}
const DEFAULT_CONFIG: UseStablecoinPriceConfig = {
  enabled: true,
  hideIfPriceImpactTooHigh: false,
}

export function useStablecoinPrice(
  currency?: Currency | null,
  config: UseStablecoinPriceConfig = DEFAULT_CONFIG,
): Price<Currency, Currency> | undefined {
  const { chainId: currentChainId } = useActiveChainId()
  const chainId = currency?.chainId
  const { enabled, hideIfPriceImpactTooHigh } = { ...DEFAULT_CONFIG, ...config }

  const cakePrice = useCakePrice()
  const stableCoin = chainId && chainId in ChainId ? STABLE_COIN[chainId as ChainId] : undefined
  const isCake = chainId && currency && CAKE[chainId] && currency.wrapped.equals(CAKE[chainId])

  const isStableCoin = currency && stableCoin && currency.wrapped.equals(stableCoin)

  const shouldEnabled = Boolean(
    currency && stableCoin && enabled && currentChainId === chainId && !isCake && !isStableCoin,
  )

  const { data: priceFromApi, isLoading } = useCurrencyUsdPrice(currency, {
    enabled: shouldEnabled,
  })

  const amountOut = useMemo(
    () => (stableCoin ? CurrencyAmount.fromRawAmount(stableCoin, 5 * 10 ** stableCoin.decimals) : undefined),
    [stableCoin],
  )

  const { trade } = useBestAMMTrade({
    amount: amountOut,
    currency: currency ?? undefined,
    baseCurrency: stableCoin,
    tradeType: TradeType.EXACT_OUTPUT,
    maxSplits: 0,
    enabled: Boolean(!isLoading && !priceFromApi && shouldEnabled),
    autoRevalidate: false,
    type: 'quoter',
  })

  const price = useMemo(() => {
    if (!currency || !stableCoin || !enabled) {
      return undefined
    }

    if (isCake && cakePrice) {
      return new Price(
        currency,
        stableCoin,
        1 * 10 ** currency.decimals,
        getFullDecimalMultiplier(stableCoin.decimals).times(cakePrice.toFixed(stableCoin.decimals)).toString(),
      )
    }

    // handle stable coin
    if (isStableCoin) {
      return new Price(stableCoin, stableCoin, '1', '1')
    }

    if (priceFromApi) {
      return new Price(
        currency,
        stableCoin,
        1 * 10 ** currency.decimals,
        getFullDecimalMultiplier(stableCoin.decimals).times(priceFromApi.toFixed(stableCoin.decimals)).toString(),
      )
    }

    if (trade) {
      const { inputAmount, outputAmount } = trade as unknown as SmartRouterTrade<TradeType>

      // if price impact is too high, don't show price
      if (hideIfPriceImpactTooHigh) {
        const { priceImpactWithoutFee } = computeTradePriceBreakdown(trade as unknown as SmartRouterTrade<TradeType>)

        if (!priceImpactWithoutFee || warningSeverity(priceImpactWithoutFee) > 2) {
          return undefined
        }
      }

      return new Price(currency, stableCoin, inputAmount.quotient, outputAmount.quotient)
    }

    return undefined
  }, [currency, stableCoin, enabled, isCake, cakePrice, isStableCoin, priceFromApi, trade, hideIfPriceImpactTooHigh])

  return price
}

export const useStablecoinPriceAmount = (
  currency?: Currency,
  amount?: number,
  config?: UseStablecoinPriceConfig,
): number | undefined => {
  const stablePrice = useStablecoinPrice(currency, { enabled: !!currency, ...config })

  if (amount) {
    if (stablePrice) {
      return multiplyPriceByAmount(stablePrice, amount)
    }
  }
  return undefined
}
