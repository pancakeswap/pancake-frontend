import useSWR from 'swr'
import { useDeferredValue, useMemo } from 'react'
import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { CurrencyAmount, TradeType, Currency } from '@pancakeswap/sdk'
import { useDebounce } from '@pancakeswap/hooks'

// import { provider } from 'utils/wagmi'
import { useGasPrice } from 'state/user/hooks'
import { useCurrentBlock } from 'state/block/hooks'

import { useCommonPools } from './useCommonPools'

interface Options {
  amount?: CurrencyAmount<Currency>
  baseCurrency?: Currency
  currency?: Currency
  tradeType?: TradeType
  maxHops?: number
  maxSplits?: number
}

export function useBestAMMTrade({ amount, baseCurrency, currency, tradeType, maxHops, maxSplits }: Options) {
  const gasPrice = useGasPrice()
  const blockNumber = useCurrentBlock()
  const { pools: candidatePools, loading, syncing } = useCommonPools(baseCurrency || amount?.currency, currency)
  const poolProvider = useMemo(() => SmartRouter.createStaticPoolProvider(candidatePools), [candidatePools])
  const deferQuotientRaw = useDeferredValue(amount?.quotient.toString())
  const deferQuotient = useDebounce(deferQuotientRaw, 150)
  const {
    data: trade,
    isLoading,
    isValidating,
  } = useSWR(
    amount && currency
      ? [
          amount.currency.chainId,
          amount.currency.symbol,
          currency.symbol,
          tradeType,
          deferQuotient,
          maxHops,
          maxSplits,
          gasPrice,
          blockNumber,
        ]
      : null,
    async () => {
      if (!deferQuotient) {
        return null
      }
      const start = Date.now()
      const res = await SmartRouter.getBestTrade(amount, currency, tradeType, {
        // TODO fix on ethereum
        gasPriceWei: async () => gasPrice || '5',
        maxHops,
        poolProvider,
        // quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: provider }),
        quoteProvider: SmartRouter.createOffChainQuoteProvider(),
        // blockNumber: () => provider({ chainId: amount.currency.chainId }).getBlockNumber(),
        blockNumber,
      })
      console.log('Getting best trade takes', Date.now() - start, deferQuotient)
      return res
    },
    {
      keepPreviousData: true,
    },
  )
  return {
    trade,
    isLoading: isLoading || loading || isValidating,
    syncing,
  }
}
