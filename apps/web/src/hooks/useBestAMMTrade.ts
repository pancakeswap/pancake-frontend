import { useQuery } from '@tanstack/react-query'
import { useDeferredValue, useEffect, useMemo, useRef } from 'react'
import {
  SmartRouter,
  PoolType,
  QuoteProvider,
  SmartRouterTrade,
  BATCH_MULTICALL_CONFIGS,
} from '@pancakeswap/smart-router/evm'
import { ChainId, CurrencyAmount, TradeType, Currency } from '@pancakeswap/sdk'
import { useDebounce, usePropsChanged } from '@pancakeswap/hooks'

import { useIsWrapping } from 'hooks/useWrapCallback'
import { publicClient } from 'utils/wagmi'
import { useCurrentBlock } from 'state/block/hooks'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { getViemClients } from 'utils/viem'
import { QUOTING_API } from 'config/constants/endpoints'
import { POOLS_NORMAL_REVALIDATE } from 'config/pools'
import { worker, worker2 } from 'utils/worker'

import {
  useCommonPools as useCommonPoolsWithTicks,
  useCommonPoolsLite,
  PoolsWithState,
  CommonPoolsParams,
} from './useCommonPools'

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
  type?: 'offchain' | 'quoter' | 'auto' | 'api'
}

export function useBestAMMTrade({ type = 'quoter', ...params }: useBestAMMTradeOptions) {
  const { amount, baseCurrency, currency, autoRevalidate, enabled = true } = params
  const isWrapping = useIsWrapping(baseCurrency, currency, amount?.toExact())

  const isQuoterEnabled = useMemo(
    () => Boolean(!isWrapping && (type === 'quoter' || type === 'auto')),
    [type, isWrapping],
  )

  const isQuoterAPIEnabled = useMemo(() => Boolean(!isWrapping && type === 'api'), [isWrapping, type])

  const apiAutoRevalidate = typeof autoRevalidate === 'boolean' ? autoRevalidate : isQuoterAPIEnabled

  // switch to api when it's stable
  // const _bestTradeFromQuoterApi = useBestAMMTradeFromQuoterApi({
  //   ...params,
  //   enabled: Boolean(enabled && isQuoterAPIEnabled),
  //   autoRevalidate: apiAutoRevalidate,
  // })
  const bestTradeFromQuoterApi = useBestAMMTradeFromQuoterWorker2({
    ...params,
    enabled: Boolean(enabled && isQuoterAPIEnabled),
    autoRevalidate: apiAutoRevalidate,
  })

  const quoterAutoRevalidate = typeof autoRevalidate === 'boolean' ? autoRevalidate : isQuoterEnabled

  const bestTradeFromQuoterWorker = useBestAMMTradeFromQuoterWorker({
    ...params,
    enabled: Boolean(enabled && isQuoterEnabled && !isQuoterAPIEnabled),
    autoRevalidate: quoterAutoRevalidate,
  })

  return useMemo(
    () => (isQuoterAPIEnabled ? bestTradeFromQuoterApi : bestTradeFromQuoterWorker),
    [bestTradeFromQuoterApi, bestTradeFromQuoterWorker, isQuoterAPIEnabled],
  )
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
    tradeType = TradeType.EXACT_INPUT,
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

    const keepPreviousDataRef = useRef<boolean>(true)

    if (currenciesUpdated) {
      keepPreviousDataRef.current = false
    }

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
    const deferQuotientRaw = useDeferredValue(amount?.quotient?.toString())
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
        amount?.currency?.symbol,
        currency?.symbol,
        tradeType,
        deferQuotient,
        maxHops,
        maxSplits,
        poolTypes,
      ],
      queryFn: async () => {
        if (!amount || !amount.currency || !currency || !deferQuotient) {
          return null
        }
        const deferAmount = CurrencyAmount.fromRawAmount(amount.currency, deferQuotient)
        const label = `[BEST_AMM](${key}) chain ${currency.chainId}, ${deferAmount.toExact()} ${
          amount.currency.symbol
        } -> ${currency.symbol}, tradeType ${tradeType}`
        SmartRouter.log(label)
        SmartRouter.metric(label, candidatePools)
        const res = await getBestTrade(deferAmount, currency, tradeType, {
          gasPriceWei:
            typeof gasPrice === 'bigint'
              ? gasPrice
              : async () => publicClient({ chainId: amount.currency.chainId }).getGasPrice(),
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
      keepPreviousData: keepPreviousDataRef.current,
      retry: false,
      staleTime: autoRevalidate ? POOLS_NORMAL_REVALIDATE[amount?.currency?.chainId] : 0,
      refetchInterval: autoRevalidate && POOLS_NORMAL_REVALIDATE[amount?.currency?.chainId],
    })

    useEffect(() => {
      if (!keepPreviousDataRef.current && trade) {
        keepPreviousDataRef.current = true
      }
    }, [trade, keepPreviousDataRef])

    const isValidating = fetchStatus === 'fetching'
    const isLoading = status === 'loading' || isPreviousData

    return {
      refresh,
      trade,
      isLoading: isLoading || loading,
      isStale: trade?.blockNumber !== blockNumber,
      error,
      syncing:
        syncing || isValidating || (amount?.quotient?.toString() !== deferQuotient && deferQuotient !== undefined),
    }
  }
}

export const useBestAMMTradeFromOffchain = bestTradeHookFactory({
  key: 'useBestAMMTradeFromOffchain',
  useCommonPools: useCommonPoolsWithTicks,
  quoteProvider: SmartRouter.createOffChainQuoteProvider(),
})

const onChainQuoteProvider = SmartRouter.createQuoteProvider({ onChainProvider: getViemClients })

export const useBestAMMTradeFromQuoter = bestTradeHookFactory({
  key: 'useBestAMMTradeFromQuoter',
  useCommonPools: useCommonPoolsLite,
  quoteProvider: onChainQuoteProvider,
  // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
  quoterOptimization: false,
})

export const useBestAMMTradeFromQuoterApi = bestTradeHookFactory({
  key: 'useBestAMMTradeFromQuoterApi',
  useCommonPools: useCommonPoolsLite,
  quoteProvider: onChainQuoteProvider,
  getBestTrade: async (
    amount,
    currency,
    tradeType,
    { maxHops, maxSplits, gasPriceWei, allowedPoolTypes, poolProvider },
  ) => {
    const candidatePools = await poolProvider.getCandidatePools({
      currencyA: amount.currency,
      currencyB: currency,
      protocols: allowedPoolTypes,
    })

    const serverRes = await fetch(`${QUOTING_API}`, {
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
        gasPriceWei: typeof gasPriceWei !== 'function' ? gasPriceWei?.toString() : undefined,
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

const createWorkerGetBestTrade = (quoteWorker: typeof worker): typeof SmartRouter.getBestTrade => {
  return async (amount, currency, tradeType, { maxHops, maxSplits, allowedPoolTypes, poolProvider, gasPriceWei }) => {
    const candidatePools = await poolProvider.getCandidatePools({
      currencyA: amount.currency,
      currencyB: currency,
      protocols: allowedPoolTypes,
    })

    const result = await quoteWorker.getBestTrade({
      chainId: currency.chainId,
      currency: SmartRouter.Transformer.serializeCurrency(currency),
      tradeType,
      amount: {
        currency: SmartRouter.Transformer.serializeCurrency(amount.currency),
        value: amount.quotient.toString(),
      },
      gasPriceWei: typeof gasPriceWei !== 'function' ? gasPriceWei?.toString() : undefined,
      maxHops,
      maxSplits,
      poolTypes: allowedPoolTypes,
      candidatePools: candidatePools.map(SmartRouter.Transformer.serializePool),
    })
    return SmartRouter.Transformer.parseTrade(currency.chainId, result as any)
  }
}

export const useBestAMMTradeFromQuoterWorker = bestTradeHookFactory({
  key: 'useBestAMMTradeFromQuoterWorker',
  useCommonPools: useCommonPoolsLite,
  quoteProvider: onChainQuoteProvider,
  getBestTrade: createWorkerGetBestTrade(worker),
  // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
  quoterOptimization: false,
})

const onChainQuoteProvider2 = SmartRouter.createQuoteProvider({
  onChainProvider: getViemClients,
  multicallConfigs: {
    ...BATCH_MULTICALL_CONFIGS,
    [ChainId.BSC]: {
      ...BATCH_MULTICALL_CONFIGS[ChainId.BSC],
      defaultConfig: {
        multicallChunk: 150,
        gasLimitOverride: 1_000_000,
      },
    },
  },
})
export const useBestAMMTradeFromQuoterWorker2 = bestTradeHookFactory({
  key: 'useBestAMMTradeFromQuoterWorker2',
  useCommonPools: useCommonPoolsLite,
  quoteProvider: onChainQuoteProvider2,
  getBestTrade: createWorkerGetBestTrade(worker2),
  // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
  quoterOptimization: false,
})
