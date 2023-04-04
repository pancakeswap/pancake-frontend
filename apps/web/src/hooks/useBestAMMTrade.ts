/* eslint-disable no-console */
import { useQuery } from '@tanstack/react-query'
import { useDeferredValue, useMemo } from 'react'
import { SmartRouter, PoolType, QuoteProvider, SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { ChainId, CurrencyAmount, TradeType, Currency, JSBI } from '@pancakeswap/sdk'
import { useDebounce, usePropsChanged } from '@pancakeswap/hooks'

import { useIsWrapping } from 'hooks/useWrapCallback'
import { provider } from 'utils/wagmi'
import { useCurrentBlock } from 'state/block/hooks'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { serializeCurrency, serializePool, parseTrade } from 'utils/routingApi'

import {
  useCommonPools as useCommonPoolsWithTicks,
  useCommonPoolsLite,
  PoolsWithState,
  CommonPoolsParams,
} from './useCommonPools'

// Revalidate interval in milliseconds
const REVALIDATE_AFTER = {
  [ChainId.BSC_TESTNET]: 15_000,
  [ChainId.BSC]: 15_000,
  [ChainId.ETHEREUM]: 20_000,
  [ChainId.GOERLI]: 20_000,
}

interface FactoryOptions {
  // use to identify hook
  key: string
  useCommonPools: (currencyA?: Currency, currencyB?: Currency, params?: CommonPoolsParams) => PoolsWithState
  getBestTrade?: typeof SmartRouter.getBestTrade
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
  autoRevalidate?: boolean
}

interface useBestAMMTradeOptions extends Options {
  type?: 'offchain' | 'quoter' | 'all'
}

export function useBestAMMTrade({ type = 'quoter', ...params }: useBestAMMTradeOptions) {
  const { amount, baseCurrency, currency } = params
  const isWrapping = useIsWrapping(baseCurrency, currency, amount?.toExact())
  const isOffChainEnabled = useMemo(
    () =>
      !isWrapping &&
      typeof window !== 'undefined' &&
      typeof window.requestIdleCallback === 'function' &&
      (type === 'offchain' || type === 'all'),
    [type, isWrapping],
  )
  const isQuoterEnabled = useMemo(() => !isWrapping && (type === 'quoter' || type === 'all'), [type, isWrapping])

  const bestTradeFromOffchain = useBestAMMTradeFromOffchain({
    ...params,
    enabled: isOffChainEnabled,
    autoRevalidate: isOffChainEnabled,
  })
  const bestTradeFromQuoter = useBestAMMTradeFromQuoter({
    ...params,
    enabled: isQuoterEnabled,
    autoRevalidate: isQuoterEnabled && !isOffChainEnabled,
  })
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
  useCommonPools,
  quoteProvider,
  quoterOptimization = true,
  getBestTrade = SmartRouter.getBestTrade,
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
    autoRevalidate,
  }: Options) {
    const { gasPrice } = useFeeDataWithGasPrice()
    const currenciesUpdated = usePropsChanged(baseCurrency, currency)

    const blockNumber = useCurrentBlock()
    const {
      refresh,
      pools: candidatePools,
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
      status,
      fetchStatus,
      isPreviousData,
      error,
    } = useQuery<SmartRouterTrade<TradeType>, Error>({
      queryKey: [
        key,
        currency?.chainId,
        amount?.currency.symbol,
        currency?.symbol,
        tradeType,
        deferQuotient,
        maxHops,
        maxSplits,
        poolTypes,
      ],
      queryFn: async () => {
        const deferAmount = CurrencyAmount.fromRawAmount(amount.currency, deferQuotient)
        const label = `[BEST_AMM](${key}) chain ${currency.chainId}, ${deferAmount.toExact()} ${
          amount.currency.symbol
        } -> ${currency.symbol}, tradeType ${tradeType}`
        SmartRouter.metric(label)
        SmartRouter.metric(label, candidatePools)
        const res = await getBestTrade(deferAmount, currency, tradeType, {
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
          SmartRouter.metric(
            label,
            res.inputAmount.toExact(),
            res.inputAmount.currency.symbol,
            '->',
            res.outputAmount.toExact(),
            res.outputAmount.currency.symbol,
            res.routes,
          )
        }
        SmartRouter.metric(label, res)
        return res
      },
      enabled: !!(amount && currency && candidatePools && !loading && deferQuotient && enabled),
      refetchOnWindowFocus: false,
      keepPreviousData: !currenciesUpdated,
      retry: false,
      staleTime: autoRevalidate ? REVALIDATE_AFTER[amount?.currency.chainId] : 0,
      refetchInterval: autoRevalidate && REVALIDATE_AFTER[amount?.currency.chainId],
    })

    const isValidating = fetchStatus === 'fetching'
    const isLoading = status === 'loading' || isPreviousData

    return {
      refresh,
      trade,
      isLoading: isLoading || loading,
      isStale: trade?.blockNumber !== blockNumber,
      error,
      syncing:
        syncing || isValidating || (amount?.quotient.toString() !== deferQuotient && deferQuotient !== undefined),
    }
  }
}

export const useBestAMMTradeFromOffchain = bestTradeHookFactory({
  key: 'useBestAMMTradeFromOffchain',
  useCommonPools: useCommonPoolsWithTicks,
  quoteProvider: SmartRouter.createOffChainQuoteProvider(),
})

export const useBestAMMTradeFromQuoter = bestTradeHookFactory({
  key: 'useBestAMMTradeFromQuoter',
  useCommonPools: useCommonPoolsLite,
  quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: provider }),
  // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
  quoterOptimization: false,
})

export const useBestAMMTradeFromQuoterApi = bestTradeHookFactory({
  key: 'useBestAMMTradeFromQuoterApi',
  useCommonPools: useCommonPoolsLite,
  quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: provider }),
  getBestTrade: async (
    amount,
    currency,
    tradeType,
    { maxHops, maxSplits, gasPriceWei, blockNumber, allowedPoolTypes, poolProvider },
  ) => {
    const blockNum = typeof blockNumber === 'number' ? blockNumber : await blockNumber()
    const candidatePools = await poolProvider.getCandidatePools(amount.currency, currency, {
      blockNumber: blockNum,
      protocols: allowedPoolTypes,
    })
    const serverRes = await fetch('/api/routing', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chainId: currency.chainId,
        currency: serializeCurrency(currency),
        tradeType,
        amount: {
          currency: serializeCurrency(amount.currency),
          value: amount.quotient.toString(),
        },
        gasPriceWei: gasPriceWei?.toString(),
        maxHops,
        maxSplits,
        blockNumber: blockNum.toString(),
        poolTypes: allowedPoolTypes,
        candidatePools: candidatePools.map(serializePool),
      }),
    })
    const serializedRes = await serverRes.json()
    return parseTrade(currency.chainId, serializedRes)
  },
  // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
  quoterOptimization: false,
})
