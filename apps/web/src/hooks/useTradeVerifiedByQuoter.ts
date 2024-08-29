import { V4Router } from '@pancakeswap/smart-router'
import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/swap-sdk-core'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchQuotes } from '@pancakeswap/routing-sdk-addon-quoter'

import { getViemClients } from 'utils/viem'
import { toRoutingSDKTrade } from 'utils/convertTrade'

type Params = {
  isLoading?: boolean
  trade?: V4Router.V4TradeWithoutGraph<TradeType>
  enabled?: boolean
  syncing?: boolean
}

export function useTradeVerifiedByQuoter<P extends Params>(p: P): P {
  const { trade, enabled, isLoading, syncing } = p
  const serializableTrade = useMemo(() => trade && V4Router.Transformer.serializeTrade(trade), [trade])
  const { data, fetchStatus } = useQuery({
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
        return trade
      }
      const quote = quotes.reduce<CurrencyAmount<Currency>>(
        (total, q) => total.add(q!),
        CurrencyAmount.fromRawAmount(quoteCurrency, 0n),
      )
      return {
        ...trade,
        routes: trade.routes.map((r, index) => ({
          ...r,
          inputAmount: isExactIn ? r.inputAmount : quotes[index],
          outputAmount: isExactIn ? quotes[index] : r.outputAmount,
        })),
        inputAmount: isExactIn ? trade.inputAmount : quote,
        outputAmount: isExactIn ? quote : trade.outputAmount,
      }
    },
  })
  return {
    ...p,
    syncing: fetchStatus === 'fetching' || syncing,
    isLoading: fetchStatus === 'pending' || isLoading,
    trade: data,
  }
}
