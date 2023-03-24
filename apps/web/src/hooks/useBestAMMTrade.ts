/* eslint-disable no-console */
import useSWR from 'swr'
import { useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { SmartRouter, PoolType, QuoteProvider } from '@pancakeswap/smart-router/evm'
import { CurrencyAmount, TradeType, Currency, JSBI } from '@pancakeswap/sdk'
import { useDebounce, usePropsChanged } from '@pancakeswap/hooks'

import { provider } from 'utils/wagmi'
import { metric } from 'utils/metric'
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
  enabled?: boolean
}

interface useBestAMMTradeOptions extends Options {
  type?: 'offchain' | 'quoter' | 'all'
}

export function useBestAMMTrade({ type = 'quoter', ...params }: useBestAMMTradeOptions) {
  const isOffCHainEnabled = useMemo(
    () =>
      typeof window !== 'undefined' &&
      typeof window.requestIdleCallback === 'function' &&
      (type === 'offchain' || type === 'all'),
    [type],
  )
  const isQuoterEnabled = useMemo(() => type === 'quoter' || type === 'all', [type])

  const bestTradeFromOffchain = useBestAMMTradeFromOffchain({ ...params, enabled: isOffCHainEnabled })
  const bestTradeFromQuoter = useBestAMMTradeFromQuoter({ ...params, enabled: isQuoterEnabled })
  return useMemo(() => {
    const { trade: tradeFromOffchain } = bestTradeFromOffchain
    const { trade: tradeFromQuoter } = bestTradeFromQuoter
    if (!tradeFromOffchain && !tradeFromQuoter) {
      return bestTradeFromOffchain
    }
    if (!tradeFromOffchain || !tradeFromQuoter) {
      // console.log(
      //   `[BEST Trade] Existing ${tradeFromOffchain ? 'Offchain' : 'Quoter'} trade is used`,
      //   tradeFromOffchain || tradeFromQuoter,
      // )
      return tradeFromOffchain ? bestTradeFromOffchain : bestTradeFromQuoter
    }
    if (JSBI.greaterThan(JSBI.BigInt(tradeFromQuoter.blockNumber), JSBI.BigInt(tradeFromOffchain.blockNumber))) {
      // console.log('[BEST Trade] Quoter trade is used', tradeFromQuoter)
      return bestTradeFromQuoter
    }
    // console.log('[BEST Trade] Offchain trade is used', tradeFromOffchain)
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
    enabled = true,
  }: Options) {
    const { gasPrice } = useFeeDataWithGasPrice()
    const lastBlock = useRef<number>(null)
    const currenciesUpdated = usePropsChanged(baseCurrency, currency)

    const blockNumber = useCurrentBlock()
    const {
      refresh,
      pools: candidatePools,
      blockNumber: poolsBlockNumber,
      loading,
      syncing,
    } = useCommonPools(baseCurrency || amount?.currency, currency, { blockNumber, allowInconsistentBlock: true })
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
      amount && currency && candidatePools && !loading && deferQuotient && enabled
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
        const deferAmount = CurrencyAmount.fromRawAmount(amount.currency, deferQuotient)
        const label = metric.time(
          `[BEST_AMM](${key}) chain ${currency.chainId}, ${deferAmount.toExact()} ${amount.currency.symbol} -> ${
            currency.symbol
          }, tradeType ${tradeType}`,
        )
        metric.timeLog(label, candidatePools)
        const res = await SmartRouter.getBestTrade(deferAmount, currency, tradeType, {
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
        })
        if (res) {
          metric.timeLog(
            label,
            res.inputAmount.toExact(),
            res.inputAmount.currency.symbol,
            '->',
            res.outputAmount.toExact(),
            res.outputAmount.currency.symbol,
            res.routes,
          )
        }
        metric.timeLog(label, res)
        metric.timeEnd(label)
        if (res?.blockNumber) {
          lastBlock.current = res?.blockNumber
        }
        return res
      },
      {
        keepPreviousData: !currenciesUpdated,
        revalidateOnFocus: false,
      },
    )

    useEffect(() => {
      // Revalidate if pools updated
      if (revalidateOnUpdate && poolsBlockNumber && lastBlock.current && poolsBlockNumber - lastBlock.current > 5) {
        mutate()
      }
      // eslint-disable-next-line
    }, [poolsBlockNumber])

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
  revalidateOnUpdate: true,
  useCommonPools: useCommonPoolsWithTicks,
  quoteProvider: SmartRouter.createOffChainQuoteProvider(),
})

export const useBestAMMTradeFromQuoter = bestTradeHookFactory({
  key: 'useBestAMMTradeFromQuoter',
  revalidateOnUpdate: false,
  useCommonPools: useCommonPoolsLite,
  quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: provider }),
  // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
  quoterOptimization: false,
})
