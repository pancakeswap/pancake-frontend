/* eslint-disable no-console */
import useSWR from 'swr'
import {
  useDeferredValue,
  // useEffect,
  useMemo,
} from 'react'
import { SmartRouter } from '@pancakeswap/smart-router/evm'
import { CurrencyAmount, TradeType, Currency, JSBI } from '@pancakeswap/sdk'
import { useDebounce } from '@pancakeswap/hooks'

import { provider } from 'utils/wagmi'
// import { useGasPrice } from 'state/user/hooks'
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
  // const gasPrice = useGasPrice()
  const blockNumber = useCurrentBlock()
  const { pools: candidatePools, loading, syncing } = useCommonPools(baseCurrency || amount?.currency, currency)
  const poolProvider = useMemo(() => SmartRouter.createStaticPoolProvider(candidatePools), [candidatePools])
  const deferQuotientRaw = useDeferredValue(amount?.quotient.toString())
  const deferQuotient = useDebounce(deferQuotientRaw, 150)
  const {
    data: trade,
    isLoading,
    isValidating,
    // mutate,
  } = useSWR(
    amount && currency && candidatePools
      ? [currency.chainId, amount.currency.symbol, currency.symbol, tradeType, deferQuotient, maxHops, maxSplits]
      : null,
    async () => {
      if (!deferQuotient) {
        return null
      }
      console.time('[METRIC] Get best AMM trade')
      console.timeLog(
        '[METRIC] Get best AMM trade',
        'Start',
        currency.chainId,
        amount.currency.symbol,
        currency.symbol,
        tradeType,
        deferQuotient,
      )
      const res = await SmartRouter.getBestTrade(amount, currency, tradeType, {
        // TODO fix on ethereum
        gasPriceWei: async () => JSBI.BigInt(await provider({ chainId: amount.currency.chainId }).getGasPrice()),
        maxHops,
        poolProvider,
        // quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: provider }),
        quoteProvider: SmartRouter.createOffChainQuoteProvider(),
        // blockNumber: () => provider({ chainId: amount.currency.chainId }).getBlockNumber(),
        blockNumber,
      })
      console.timeLog('[METRIC] Get best AMM trade', res)
      console.timeEnd('[METRIC] Get best AMM trade')
      return res
    },
    {
      revalidateOnFocus: false,
    },
  )

  // useEffect(() => {
  //   // Revalidate if block height increases or gas price changed
  //   mutate()
  // }, [blockNumber, mutate])

  return {
    trade,
    isLoading: isLoading || loading,
    syncing: syncing || isValidating,
  }
}
