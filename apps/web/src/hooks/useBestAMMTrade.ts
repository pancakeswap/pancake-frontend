/* eslint-disable no-console */
import useSWR from 'swr'
import { useDeferredValue, useEffect, useMemo } from 'react'
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
  const blockNum = useCurrentBlock()
  const blockNumber = useMemo(() => JSBI.BigInt(blockNum), [blockNum])
  const {
    pools: candidatePools,
    loading,
    syncing,
  } = useCommonPools(baseCurrency || amount?.currency, currency, { blockNumber: JSBI.BigInt(blockNumber) })
  const poolProvider = useMemo(() => SmartRouter.createStaticPoolProvider(candidatePools), [candidatePools])
  const deferQuotientRaw = useDeferredValue(amount?.quotient.toString())
  const deferQuotient = useDebounce(deferQuotientRaw, 150)
  const {
    data: trade,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    amount && currency && candidatePools
      ? [currency.chainId, amount.currency.symbol, currency.symbol, tradeType, deferQuotient, maxHops, maxSplits]
      : null,
    async () => {
      if (!deferQuotient) {
        return null
      }
      const label = '[METRIC] Get best AMM trade'
      console.time(label)
      console.timeLog(
        label,
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
      console.timeLog(label, res)
      console.timeEnd(label)
      return res
    },
    {
      revalidateOnFocus: false,
    },
  )

  // useEffect(() => {
  //   // Revalidate if pools updated
  //   mutate()
  //   // eslint-disable-next-line
  // }, [candidatePools])

  return {
    trade,
    isLoading: isLoading || loading,
    syncing: syncing || isValidating,
  }
}
