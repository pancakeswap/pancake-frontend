import useSWR from 'swr'
import { useDeferredValue } from 'react'
import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { CurrencyAmount, TradeType, Currency } from '@pancakeswap/sdk'

import { provider } from 'utils/wagmi'

interface Options {
  amount?: CurrencyAmount<Currency>
  currency?: Currency
  tradeType?: TradeType
  maxHops?: number
  maxSplits?: number
}

export function useBestAMMTrade({ amount, currency, tradeType, maxHops, maxSplits }: Options) {
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
        poolProvider: SmartRouter.createPoolProvider({ onChainProvider: provider }),
        quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: provider }),
        blockNumber: () => provider({ chainId: amount.currency.chainId }).getBlockNumber(),
      }),
    {
      keepPreviousData: true,
    },
  )
  return {
    trade,
    isLoading,
  }
}
