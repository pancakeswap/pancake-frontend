import { Currency, CurrencyAmount, Price, TradeType } from '@pancakeswap/sdk'
import { ChainId } from '@pancakeswap/chains'
import { CAKE, STABLE_COIN } from '@pancakeswap/tokens'
import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { multiplyPriceByAmount } from 'utils/prices'
import { useCakePrice } from 'hooks/useCakePrice'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import { SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { computeTradePriceBreakdown } from 'views/Swap/V3Swap/utils/exchange'
import { fetchTokenUSDValue } from 'utils/llamaPrice'
import { warningSeverity } from 'utils/exchange'
import { useActiveChainId } from './useActiveChainId'
import { useBestAMMTrade } from './useBestAMMTrade'

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

  const shouldEnabled = currency && stableCoin && enabled && currentChainId === chainId && !isCake && !isStableCoin

  const enableLlama =
    (currency?.chainId === ChainId.ETHEREUM || currency?.chainId === ChainId.POLYGON_ZKEVM) && shouldEnabled

  // we don't have too many AMM pools on ethereum yet, try to get it from api
  const { data: priceFromLlama, isLoading } = useSWRImmutable<string | undefined>(
    currency && enableLlama && ['fiat-price-llama', currency],
    async () => {
      if (!currency) {
        return undefined
      }
      const tokenAddress = currency.wrapped.address
      const result = await fetchTokenUSDValue(currency.chainId, [tokenAddress])
      return result.get(tokenAddress)
    },
    {
      dedupingInterval: 30_000,
      refreshInterval: 30_000,
    },
  )

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
    enabled: Boolean(enableLlama ? !isLoading && !priceFromLlama : shouldEnabled),
    autoRevalidate: false,
    type: 'api',
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

    if (priceFromLlama && enableLlama) {
      return new Price(
        currency,
        stableCoin,
        1 * 10 ** currency.decimals,
        getFullDecimalMultiplier(stableCoin.decimals)
          .times(parseFloat(priceFromLlama).toFixed(stableCoin.decimals))
          .toString(),
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
  }, [
    currency,
    stableCoin,
    enabled,
    isCake,
    cakePrice,
    isStableCoin,
    priceFromLlama,
    enableLlama,
    trade,
    hideIfPriceImpactTooHigh,
  ])

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
