/* eslint-disable no-console */
import { useQuery } from '@tanstack/react-query'
import { useDeferredValue, useMemo } from 'react'
import { SmartRouter, PoolType, QuoteProvider, SmartRouterTrade } from '@pancakeswap/smart-router/evm'
import { ChainId, CurrencyAmount, TradeType, Currency, JSBI } from '@pancakeswap/sdk'
import { useDebounce, usePropsChanged } from '@pancakeswap/hooks'
import { isDesktop } from 'react-device-detect'

import { useIsWrapping } from 'hooks/useWrapCallback'
import { provider } from 'utils/wagmi'
import { useCurrentBlock } from 'state/block/hooks'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { viemClients } from 'utils/viem'

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
  type?: 'offchain' | 'quoter' | 'auto'
}

const isLowEndDevice = typeof window !== 'undefined' && !(isDesktop && typeof window.requestIdleCallback === 'function')

export function useBestAMMTrade({ type = 'quoter', ...params }: useBestAMMTradeOptions) {
  const { amount, baseCurrency, currency, autoRevalidate, enabled = true } = params
  const isWrapping = useIsWrapping(baseCurrency, currency, amount?.toExact())

  const isOffChainEnabled = useMemo(
    () => Boolean(!isWrapping && !isLowEndDevice && (type === 'offchain' || type === 'auto')),
    [type, isWrapping],
  )

  // const isQuoterEnabled = useMemo(
  //   () => Boolean(!isWrapping && (type === 'quoter' || type === 'auto') && !isLowEndDevice),
  //   [type, isWrapping],
  // )
  const isQuoterEnabled = useMemo(
    () => Boolean(!isWrapping && (type === 'quoter' || type === 'auto')),
    [type, isWrapping],
  )

  const isQuoterAPIEnabled = false
  // const isQuoterAPIEnabled = useMemo(
  //   () => Boolean(!isWrapping && (type === 'quoter' || type === 'auto') && isLowEndDevice),
  //   [isWrapping, type],
  // )

  const offChainAutoRevalidate = typeof autoRevalidate === 'boolean' ? autoRevalidate : isOffChainEnabled
  const bestTradeFromOffchain = useBestAMMTradeFromOffchain({
    ...params,
    enabled: Boolean(enabled && isOffChainEnabled),
    autoRevalidate: offChainAutoRevalidate,
  })
  const apiAutoRevalidate =
    typeof autoRevalidate === 'boolean' ? autoRevalidate : isQuoterAPIEnabled && !isOffChainEnabled

  const bestTradeFromQuoterApi = useBestAMMTradeFromQuoterApi({
    ...params,
    enabled: Boolean(enabled && isQuoterAPIEnabled),
    autoRevalidate: apiAutoRevalidate,
  })

  const quoterAutoRevalidate =
    typeof autoRevalidate === 'boolean' ? autoRevalidate : isQuoterEnabled && !isOffChainEnabled
  const bestTradeFromQuoter = useBestAMMTradeFromQuoter({
    ...params,
    enabled: Boolean(enabled && isQuoterEnabled),
    autoRevalidate: quoterAutoRevalidate,
  })

  return useMemo(() => {
    const { trade: tradeFromOffchain } = bestTradeFromOffchain
    const { trade: tradeFromQuoter } = bestTradeFromQuoter
    const { trade: tradeFromApi } = bestTradeFromQuoterApi

    const quoterTrade = tradeFromApi || tradeFromQuoter
    const bestTradeFromQuoter_ = isQuoterAPIEnabled ? bestTradeFromQuoterApi : bestTradeFromQuoter

    if (!tradeFromOffchain && !quoterTrade) {
      return bestTradeFromOffchain
    }
    if (!tradeFromOffchain || !quoterTrade) {
      // console.log(
      //   `[BEST Trade] Existing ${tradeFromOffchain ? 'Offchain' : 'Quoter'} trade is used`,
      //   tradeFromOffchain || tradeFromQuoter,
      // )
      return tradeFromOffchain ? bestTradeFromOffchain : bestTradeFromQuoter_
    }

    if (
      quoterTrade.blockNumber &&
      tradeFromOffchain.blockNumber &&
      JSBI.greaterThan(JSBI.BigInt(quoterTrade.blockNumber), JSBI.BigInt(tradeFromOffchain.blockNumber))
    ) {
      // console.log('[BEST Trade] Quoter trade is used', tradeFromQuoter)
      return bestTradeFromQuoter_
    }

    // console.log('[BEST Trade] Offchain trade is used', tradeFromOffchain)
    return bestTradeFromOffchain
  }, [bestTradeFromOffchain, bestTradeFromQuoter, bestTradeFromQuoterApi, isQuoterAPIEnabled])
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
    } = useCommonPools(baseCurrency || amount?.currency, currency, {
      blockNumber,
      allowInconsistentBlock: true,
      enabled,
    })
    const poolProvider = useMemo(() => SmartRouter.createStaticPoolProvider(candidatePools), [candidatePools])
    const deferQuotientRaw = useDeferredValue(amount?.quotient.toString())
    const deferQuotient = useDebounce(deferQuotientRaw, 500)

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
        SmartRouter.log(label)
        SmartRouter.metric(label, candidatePools)
        const res = await getBestTrade(deferAmount, currency, tradeType, {
          gasPriceWei: gasPrice
            ? JSBI.BigInt(gasPrice)
            : async () => JSBI.BigInt(await provider({ chainId: amount.currency.chainId }).getGasPrice()),
          maxHops,
          poolProvider,
          maxSplits,
          quoteProvider,
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
        SmartRouter.log(label, res)
        return {
          ...res,
          blockNumber,
        }
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
  quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: viemClients }),
  quoterOptimization: true,
})

export const useBestAMMTradeFromQuoterApi = bestTradeHookFactory({
  key: 'useBestAMMTradeFromQuoterApi',
  useCommonPools: useCommonPoolsLite,
  quoteProvider: SmartRouter.createQuoteProvider({ onChainProvider: viemClients }),
  getBestTrade: async (
    amount,
    currency,
    tradeType,
    { maxHops, maxSplits, gasPriceWei, allowedPoolTypes, poolProvider },
  ) => {
    const candidatePools = await poolProvider.getCandidatePools(amount.currency, currency, {
      protocols: allowedPoolTypes,
    })

    const serverRes = await fetch(`${process.env.NEXT_PUBLIC_ROUTING_API}/v0/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chainId: currency.chainId,
        currency: SmartRouter.Transformer.serializeCurrency(currency),
        tradeType,
        amount: {
          currency: SmartRouter.Transformer.serializeCurrency(amount.currency),
          value: amount.quotient.toString(),
        },
        gasPriceWei: gasPriceWei?.toString(),
        maxHops,
        maxSplits,
        poolTypes: allowedPoolTypes,
        candidatePools: candidatePools.map(SmartRouter.Transformer.serializePool),
      }),
    })
    const serializedRes = await serverRes.json()
    return SmartRouter.Transformer.parseTrade(currency.chainId, serializedRes)
  },
  // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
  quoterOptimization: false,
})
