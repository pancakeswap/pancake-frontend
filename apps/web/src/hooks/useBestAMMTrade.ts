/* eslint-disable no-console */
import useSWR from 'swr'
import { useDeferredValue, useEffect, useMemo } from 'react'
import { SmartRouter, PoolType, QuoteProvider } from '@pancakeswap/smart-router/evm'
import { CurrencyAmount, TradeType, Currency, JSBI } from '@pancakeswap/sdk'
import { useDebounce } from '@pancakeswap/hooks'

import { provider } from 'utils/wagmi'
import { useCurrentBlock } from 'state/block/hooks'

import { useFeeDataWithGasPrice } from 'state/user/hooks'
import {
  useCommonPools as useCommonPoolsWithTicks,
  useCommonPoolsLite,
  PoolsWithState,
  CommonPoolsParams,
} from './useCommonPools'

interface FactoryOptions {
  // use to identify hook
  key: string
  revalidateOnUpdate?: boolean
  useCommonPools: (currencyA?: Currency, currencyB?: Currency, params?: CommonPoolsParams) => PoolsWithState
  quoteProvider: QuoteProvider

  // Decrease the size of batch getting quotes for better performance
  quoterOptimization?: boolean
}

interface Options {
  amount?: CurrencyAmount<Currency>
  baseCurrency?: Currency
  currency?: Currency
  tradeType?: TradeType
  maxHops?: number
  maxSplits?: number
  v2Swap?: boolean
  v3Swap?: boolean
  stableSwap?: boolean
}

export function useBestAMMTrade(params: Options) {
  const bestTradeFromOffchain = useBestAMMTradeFromOffchain(params)
  const bestTradeFromQuoter = useBestAMMTradeFromQuoter(params)
  return useMemo(() => {
    const { trade: tradeFromOffchain } = bestTradeFromOffchain
    const { trade: tradeFromQuoter } = bestTradeFromQuoter
    if (!tradeFromOffchain && !tradeFromQuoter) {
      return bestTradeFromOffchain
    }
    if (!tradeFromOffchain || !tradeFromQuoter) {
      console.log(
        `[BEST Trade] Existing ${tradeFromOffchain ? 'Offchain' : 'Quoter'} trade is used`,
        tradeFromOffchain || tradeFromQuoter,
      )
      return bestTradeFromOffchain || bestTradeFromQuoter
    }
    if (JSBI.greaterThan(JSBI.BigInt(tradeFromQuoter.blockNumber), JSBI.BigInt(tradeFromOffchain.blockNumber))) {
      console.log('[BEST Trade] Quoter trade is used', tradeFromQuoter)
      return bestTradeFromQuoter
    }
    console.log('[BEST Trade] Offchain trade is used', tradeFromOffchain)
    return bestTradeFromOffchain
  }, [bestTradeFromOffchain, bestTradeFromQuoter])
}

function bestTradeHookFactory({
  key,
  revalidateOnUpdate = true,
  useCommonPools,
  quoteProvider,
  quoterOptimization = true,
}: FactoryOptions) {
  return function useBestTrade({
    amount,
    baseCurrency,
    currency,
    tradeType,
    maxHops,
    maxSplits,
    v2Swap = true,
    v3Swap = true,
    stableSwap = true,
  }: Options) {
    const { gasPrice } = useFeeDataWithGasPrice()

    const blockNumber = useCurrentBlock()
    const {
      refresh,
      pools: candidatePools,
      loading,
      syncing,
    } = useCommonPools(baseCurrency || amount?.currency, currency, { blockNumber })
    const poolProvider = useMemo(() => SmartRouter.createStaticPoolProvider(candidatePools), [candidatePools])
    const deferQuotientRaw = useDeferredValue(amount?.quotient.toString())
    const deferQuotient = useDebounce(deferQuotientRaw, 300)

    const poolTypes = useMemo(() => {
      const types: PoolType[] = []
      if (v2Swap) {
        types.push(PoolType.V2)
      }
      if (v3Swap) {
        types.push(PoolType.V3)
      }
      if (stableSwap) {
        types.push(PoolType.STABLE)
      }
      return types
    }, [v2Swap, v3Swap, stableSwap])

    const {
      data: trade,
      isLoading,
      isValidating,
      mutate,
    } = useSWR(
      amount && currency && candidatePools && !loading
        ? [
            key,
            currency.chainId,
            amount.currency.symbol,
            currency.symbol,
            tradeType,
            deferQuotient,
            maxHops,
            maxSplits,
            poolTypes,
          ]
        : null,
      async () => {
        if (!deferQuotient) {
          return null
        }
        const label = `[METRIC] Get best AMM trade (${key})`
        console.time(label)
        console.timeLog(
          label,
          'Start',
          currency.chainId,
          amount.currency.symbol,
          currency.symbol,
          tradeType,
          deferQuotient,
          candidatePools,
        )
        const res = await SmartRouter.getBestTrade(
          CurrencyAmount.fromRawAmount(amount.currency, deferQuotient),
          currency,
          tradeType,
          {
            gasPriceWei: gasPrice
              ? JSBI.BigInt(gasPrice)
              : async () => JSBI.BigInt(await provider({ chainId: amount.currency.chainId }).getGasPrice()),
            maxHops,
            poolProvider,
            maxSplits,
            quoteProvider,
            blockNumber,
            allowedPoolTypes: poolTypes,
            quoterOptimization,
          },
        )
        console.timeLog(label, res)
        console.timeEnd(label)
        return res
      },
      {
        keepPreviousData: true,
        revalidateOnFocus: false,
      },
    )

    useEffect(() => {
      // Revalidate if pools updated
      if (revalidateOnUpdate) {
        mutate()
      }
      // eslint-disable-next-line
    }, [candidatePools])

    return {
      refresh,
      trade,
      isLoading: isLoading || loading,
      isStale: trade?.blockNumber !== blockNumber,
      syncing:
        syncing || isValidating || (amount?.quotient.toString() !== deferQuotient && deferQuotient !== undefined),
    }
  }
}

export const useBestAMMTradeFromOffchain = bestTradeHookFactory({
  key: 'useBestAMMTradeFromOffchain',
  revalidateOnUpdate: false,
  useCommonPools: useCommonPoolsWithTicks,
  quoteProvider: SmartRouter.createOffChainQuoteProvider(),
})

export const useBestAMMTradeFromQuoter = bestTradeHookFactory({
  key: 'useBestAMMTradeFromQuoter',
  revalidateOnUpdate: true,
  useCommonPools: useCommonPoolsLite,
  quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: provider }),
  // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
  quoterOptimization: false,
})
