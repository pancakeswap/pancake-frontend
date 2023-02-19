import useSWR from 'swr'
import { useDeferredValue, useMemo } from 'react'
import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { CurrencyAmount, TradeType, Currency } from '@pancakeswap/sdk'

import { provider } from 'utils/wagmi'

import { useCommonPools } from './useCommonPools'

interface Options {
  amount?: CurrencyAmount<Currency>
  currency?: Currency
  tradeType?: TradeType
  maxHops?: number
  maxSplits?: number
}

export function useBestAMMTrade({ amount, currency, tradeType, maxHops, maxSplits }: Options) {
  const { pools: candidatePools, loading, syncing } = useCommonPools(amount?.currency, currency)
  const poolProvider = useMemo(() => SmartRouter.createStaticPoolProvider(candidatePools), [candidatePools])
  const deferQuotient = useDeferredValue(amount?.quotient.toString())
  const { data: trade, isLoading } = useSWR(
    amount && currency
      ? [amount.currency.chainId, amount.currency.symbol, currency.symbol, tradeType, deferQuotient, maxHops, maxSplits]
      : null,
    async () =>
      SmartRouter.getBestTrade(amount, currency, tradeType, {
        gasPriceWei: async () => {
          const price = await provider({ chainId: amount.currency.chainId }).getGasPrice()
          return price.toString()
        },
        maxHops,
        poolProvider,
        quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: provider }),
        blockNumber: () => provider({ chainId: amount.currency.chainId }).getBlockNumber(),
      }),
    {
      keepPreviousData: true,
    },
  )
  return {
    trade,
    isLoading: isLoading || loading,
    syncing,
  }
}
