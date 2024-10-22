import { V4Router } from '@pancakeswap/smart-router'
import { CurrencyAmount, Fraction, TradeType } from '@pancakeswap/swap-sdk-core'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchQuotes, Quote } from '@pancakeswap/routing-sdk-addon-quoter'

import { getViemClients } from 'utils/viem'
import { toRoutingSDKTrade } from 'utils/convertTrade'
import { POOLS_NORMAL_REVALIDATE } from 'config/pools'

type Params = {
  isLoading?: boolean
  trade?: V4Router.V4TradeWithoutGraph<TradeType>
  enabled?: boolean
  syncing?: boolean
  error?: Error
}

export function useTradeVerifiedByQuoter<P extends Params>(p: P): P {
  const { trade, enabled, syncing, isLoading } = p
  const serializableTrade = useMemo(() => trade && V4Router.Transformer.serializeTrade(trade), [trade])
  const { data, fetchStatus, error, isPlaceholderData } = useQuery({
    enabled: Boolean(enabled && serializableTrade && trade),
    queryKey: [serializableTrade],
    queryFn: async () => {
      if (!trade) throw new Error(`Invalid trade ${trade} to verify`)
      const isExactIn = trade.tradeType === TradeType.EXACT_INPUT
      const quoteCurrency = isExactIn ? trade.outputAmount.currency : trade.inputAmount.currency
      const sdkTrade = toRoutingSDKTrade(trade)
      const quotes = await fetchQuotes({
        routes: sdkTrade.routes.map((r) => ({
          ...r,
          amount: isExactIn ? r.inputAmount : r.outputAmount,
        })),
        client: getViemClients({ chainId: trade.inputAmount.currency.chainId }),
      })
      if (quotes.some((q) => q === undefined)) {
        throw new Error('Fail to validate')
      }
      const { quote, gasUseEstimate } = quotes.reduce<NonNullable<Quote>>(
        (total, q) => ({
          quote: total.quote.add(CurrencyAmount.fromRawAmount(quoteCurrency, q!.quote.quotient)),
          gasUseEstimate: total.gasUseEstimate + q!.gasUseEstimate,
        }),
        {
          quote: CurrencyAmount.fromRawAmount(quoteCurrency, 0n),
          gasUseEstimate: 0n,
        },
      )
      return {
        ...trade,
        routes: trade.routes.map((r, index) => ({
          ...r,
          inputAmount: isExactIn ? r.inputAmount : quotes[index]?.quote,
          outputAmount: isExactIn ? quotes[index]?.quote : r.outputAmount,
          ...reviseGasUseEstimate(trade.tradeType, r, quotes[index]!.gasUseEstimate),
        })),
        inputAmount: isExactIn ? trade.inputAmount : quote,
        outputAmount: isExactIn ? quote : trade.outputAmount,
        ...reviseGasUseEstimate(trade.tradeType, trade, gasUseEstimate),
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
    staleTime: trade?.inputAmount.currency.chainId ? POOLS_NORMAL_REVALIDATE[trade?.inputAmount.currency.chainId] : 0,
  })
  return {
    ...p,
    syncing: fetchStatus === 'fetching' || syncing,
    isLoading: isPlaceholderData || isLoading,
    trade: error ? trade : data,
  }
}

type GasUseEstimate = Pick<
  V4Router.V4TradeWithoutGraph<TradeType>,
  | 'gasUseEstimate'
  | 'inputAmountWithGasAdjusted'
  | 'outputAmountWithGasAdjusted'
  | 'gasUseEstimateBase'
  | 'gasUseEstimateQuote'
>

function reviseGasUseEstimate(
  tradeType: TradeType,
  estimate: GasUseEstimate,
  actualGasUseEstimate: bigint,
): GasUseEstimate {
  const isExactIn = tradeType === TradeType.EXACT_INPUT
  const factor = new Fraction(actualGasUseEstimate, estimate.gasUseEstimate)
  const gasUseEstimateBase = estimate.gasUseEstimateBase.multiply(factor)
  const gasUseEstimateQuote = estimate.gasUseEstimateQuote.multiply(factor)
  const inputAmountWithGasAdjusted = isExactIn
    ? estimate.inputAmountWithGasAdjusted
    : estimate.inputAmountWithGasAdjusted.subtract(estimate.gasUseEstimateQuote).add(gasUseEstimateQuote)
  const outputAmountWithGasAdjusted = isExactIn
    ? estimate.outputAmountWithGasAdjusted.add(estimate.gasUseEstimateQuote).subtract(gasUseEstimateQuote)
    : estimate.outputAmountWithGasAdjusted

  return {
    gasUseEstimateBase,
    gasUseEstimateQuote,
    inputAmountWithGasAdjusted,
    outputAmountWithGasAdjusted,
    gasUseEstimate: actualGasUseEstimate,
  }
}
