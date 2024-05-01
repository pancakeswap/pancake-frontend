import { ChainId } from '@pancakeswap/chains'
import { useDebounce, usePreviousValue, usePropsChanged } from '@pancakeswap/hooks'
import { getPoolTypeKey, getRequestBody, parseAMMPriceResponse, parseQuoteResponse } from '@pancakeswap/price-api-sdk'
import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/sdk'
import {
  BATCH_MULTICALL_CONFIGS,
  PoolType,
  QuoteProvider,
  Route,
  SmartRouter,
  SmartRouterTrade,
  V4Router,
} from '@pancakeswap/smart-router'
import { BigintIsh } from '@pancakeswap/swap-sdk-core'
import { AbortControl } from '@pancakeswap/utils/abortControl'
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query'
import qs from 'qs'
import { useCallback, useDeferredValue, useEffect, useMemo, useRef } from 'react'
import { zeroAddress } from 'viem'
import { useAccount } from 'wagmi'

import { QUOTING_API, QUOTING_API_PREFIX } from 'config/constants/endpoints'
import { EXPERIMENTAL_FEATURES } from 'config/experimentalFeatures'
import { POOLS_FAST_REVALIDATE, POOLS_NORMAL_REVALIDATE } from 'config/pools'
import { useIsWrapping } from 'hooks/useWrapCallback'
import { useCurrentBlock } from 'state/block/hooks'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { tracker } from 'utils/datadog'
import { createViemPublicClientGetter } from 'utils/viem'
import { publicClient } from 'utils/wagmi'

import useNativeCurrency from 'hooks/useNativeCurrency'
import { useUserXEnable } from 'state/user/smartRouter'
import {
  CommonPoolsParams,
  PoolsWithState,
  useCommonPoolsLite,
  useCommonPoolsOnChain,
  useCommonPools as useCommonPoolsWithTicks,
} from './useCommonPools'
import { useCurrencyUsdPrice } from './useCurrencyUsdPrice'
import { useExperimentalFeatureEnabled } from './useExperimentalFeatureEnabled'
import { useMulticallGasLimit } from './useMulticallGasLimit'
import { useSpeedQuote } from './useSpeedQuote'
import { useTokenFee } from './useTokenFee'
import { useGlobalWorker } from './useWorker'

export class NoValidRouteError extends Error {
  constructor(message?: string) {
    super(message)
    this.name = 'NoValidRouteError'
  }
}

SmartRouter.logger.enable('error,log')

type CreateQuoteProviderParams = {
  gasLimit?: bigint
} & AbortControl

type GetBestTradeParams = Parameters<typeof SmartRouter.getBestTrade>

interface FactoryOptions<T> {
  // use to identify hook
  key: string
  useCommonPools: (currencyA?: Currency, currencyB?: Currency, params?: CommonPoolsParams) => PoolsWithState
  useGetBestTrade: () => (...args: GetBestTradeParams) => Promise<T | undefined | null>
  createQuoteProvider: (params: CreateQuoteProviderParams) => QuoteProvider

  // Decrease the size of batch getting quotes for better performance
  quoterOptimization?: boolean
}

interface Options {
  amount?: CurrencyAmount<Currency>
  baseCurrency?: Currency | null
  currency?: Currency | null
  tradeType?: TradeType
  maxHops?: number
  maxSplits?: number
  v2Swap?: boolean
  v3Swap?: boolean
  stableSwap?: boolean
  enabled?: boolean
  autoRevalidate?: boolean
  trackPerf?: boolean
}

interface useBestAMMTradeOptions extends Options {
  type?: 'offchain' | 'quoter' | 'auto' | 'api'
}

type QuoteResult = ReturnType<ReturnType<typeof bestTradeHookFactory>>

function useBetterQuote<A extends QuoteResult, B extends QuoteResult>(quoteA: A, quoteB: B) {
  return useMemo(() => {
    if (!quoteB.trade) {
      return quoteA
    }
    if (!quoteA.trade && quoteB.trade) {
      return quoteB
    }
    return quoteA.trade!.tradeType === TradeType.EXACT_INPUT
      ? quoteB.trade?.outputAmount.greaterThan(quoteA.trade!.outputAmount)
        ? quoteB
        : quoteA
      : quoteB.trade?.inputAmount.lessThan(quoteA.trade!.inputAmount)
      ? quoteB
      : quoteA
  }, [quoteA, quoteB])
}

export function useBestAMMTrade({ type = 'quoter', ...params }: useBestAMMTradeOptions) {
  const { amount, baseCurrency, currency, autoRevalidate, enabled = true } = params
  const [speedQuoteEnabled] = useSpeedQuote()
  const isWrapping = useIsWrapping(baseCurrency, currency, amount?.toExact())

  const isQuoterEnabled = useMemo(
    () => Boolean(!isWrapping && (type === 'quoter' || type === 'auto')),
    [type, isWrapping],
  )

  const isPriceApiEnabled = useExperimentalFeatureEnabled(EXPERIMENTAL_FEATURES.PriceAPI)
  const [isXEnabled] = useUserXEnable()
  const isQuoterAPIEnabled = useMemo(() => Boolean(!isWrapping && type === 'api'), [isWrapping, type])

  const apiAutoRevalidate = typeof autoRevalidate === 'boolean' ? autoRevalidate : isQuoterAPIEnabled

  useBestTradeFromApi({
    ...params,
    enabled: Boolean(enabled && isPriceApiEnabled && !isXEnabled),
    autoRevalidate: apiAutoRevalidate,
  })

  const bestTradeFromQuoterApi = useBestAMMTradeFromQuoterWorker2({
    ...params,
    enabled: Boolean(enabled && isQuoterAPIEnabled),
    autoRevalidate: apiAutoRevalidate,
  })

  const quoterAutoRevalidate = typeof autoRevalidate === 'boolean' ? autoRevalidate : isQuoterEnabled

  const offchainQuoterEnabled = Boolean(enabled && isQuoterEnabled && !isQuoterAPIEnabled && speedQuoteEnabled)
  const bestTradeFromQuickOnChainQuote = useBestAMMTradeFromQuoterWorker({
    ...params,
    maxHops: 1,
    maxSplits: 0,
    enabled: offchainQuoterEnabled,
    autoRevalidate: quoterAutoRevalidate,
  })
  const bestTradeFromOffchainQuoter = useBestAMMTradeFromOffchainQuoter({
    ...params,
    enabled: offchainQuoterEnabled,
    autoRevalidate: quoterAutoRevalidate,
  })
  const bestOffchainWithQuickOnChainQuote = useBetterQuote(bestTradeFromOffchainQuoter, bestTradeFromQuickOnChainQuote)

  const noValidRouteFromOffchainQuoter =
    Boolean(amount) &&
    !bestTradeFromOffchainQuoter.trade &&
    !bestTradeFromOffchainQuoter.isLoading &&
    bestTradeFromOffchainQuoter.error instanceof NoValidRouteError

  const shouldFallbackQuoterOnChain = !speedQuoteEnabled || noValidRouteFromOffchainQuoter
  const bestTradeFromOnChainQuoter = useBestAMMTradeFromQuoterWorker({
    ...params,
    enabled: Boolean(enabled && isQuoterEnabled && !isQuoterAPIEnabled && shouldFallbackQuoterOnChain),
    autoRevalidate: quoterAutoRevalidate,
  })

  const bestTradeFromQuoterWorker = shouldFallbackQuoterOnChain
    ? bestTradeFromOnChainQuoter
    : bestOffchainWithQuickOnChainQuote

  return useMemo(
    () => (isQuoterAPIEnabled ? bestTradeFromQuoterApi : bestTradeFromQuoterWorker),
    [bestTradeFromQuoterApi, bestTradeFromQuoterWorker, isQuoterAPIEnabled],
  )
}

function createSimpleUseGetBestTradeHook<T>(
  getBestTrade: (...args: Parameters<typeof SmartRouter.getBestTrade>) => Promise<T | undefined | null>,
) {
  return function useGetBestTrade() {
    return useCallback(getBestTrade, [])
  }
}

function bestTradeHookFactory<
  T extends Pick<SmartRouterTrade<TradeType>, 'inputAmount' | 'outputAmount' | 'tradeType'> & {
    routes: Pick<Route, 'path' | 'pools' | 'inputAmount' | 'outputAmount'>[]
    blockNumber?: BigintIsh
  },
>({
  key,
  useCommonPools,
  createQuoteProvider: createCustomQuoteProvider,
  quoterOptimization = true,
  useGetBestTrade,
}: FactoryOptions<T>) {
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
    trackPerf,
  }: Options) {
    const getBestTrade = useGetBestTrade()
    const { gasPrice } = useFeeDataWithGasPrice()
    const gasLimit = useMulticallGasLimit(currency?.chainId)
    const currenciesUpdated = usePropsChanged(baseCurrency, currency)
    const queryClient = useQueryClient()

    const keepPreviousDataRef = useRef<boolean>(true)

    if (currenciesUpdated) {
      keepPreviousDataRef.current = false
    }

    const blockNumber = useCurrentBlock()
    const {
      refresh: refreshPools,
      pools: candidatePools,
      loading,
      syncing,
    } = useCommonPools(baseCurrency || amount?.currency, currency ?? undefined, {
      blockNumber,
      allowInconsistentBlock: true,
      enabled,
    })

    const { data: tokenInFee } = useTokenFee(baseCurrency && baseCurrency.isToken ? baseCurrency : undefined)
    const { data: tokenOutFee } = useTokenFee(currency && currency.isToken ? currency : undefined)

    const candidatePoolsWithoutV3WithFot = useMemo(() => {
      let pools = candidatePools
      if (tokenInFee && tokenInFee.result.sellFeeBps > 0n) {
        pools = pools?.filter(
          (pool) =>
            !(
              pool.type === PoolType.V3 &&
              baseCurrency &&
              (pool.token0.equals(baseCurrency) || pool.token1.equals(baseCurrency))
            ),
        )
      }
      if (tokenOutFee && tokenOutFee.result.buyFeeBps > 0n) {
        pools = pools?.filter(
          (pool) =>
            !(pool.type === PoolType.V3 && currency && (pool.token0.equals(currency) || pool.token1.equals(currency))),
        )
      }

      return pools
    }, [candidatePools, tokenInFee, tokenOutFee, baseCurrency, currency])

    const poolProvider = useMemo(
      () => SmartRouter.createStaticPoolProvider(candidatePoolsWithoutV3WithFot),
      [candidatePoolsWithoutV3WithFot],
    )
    const deferQuotientRaw = useDeferredValue(amount?.quotient?.toString())
    const deferQuotient = useDebounce(deferQuotientRaw, 500)
    const { data: quoteCurrencyUsdPrice } = useCurrencyUsdPrice(currency ?? undefined)
    const currencyNativeChain = useNativeCurrency(currency?.chainId)
    const { data: nativeCurrencyUsdPrice } = useCurrencyUsdPrice(currencyNativeChain)

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
      isPlaceholderData,
      error,
      refetch,
    } = useQuery<T | undefined>({
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
      queryFn: async ({ signal }) => {
        if (!amount || !amount.currency || !currency || !deferQuotient) {
          return undefined
        }
        const quoteProvider = createCustomQuoteProvider({
          gasLimit,
          signal,
        })

        const deferAmount = CurrencyAmount.fromRawAmount(amount.currency, deferQuotient)
        const label = `[BEST_AMM](${key}) chain ${currency.chainId}, ${deferAmount.toExact()} ${
          amount.currency.symbol
        } -> ${currency.symbol}, tradeType ${tradeType}`
        const startTime = performance.now()
        SmartRouter.logger.log(label)
        SmartRouter.logger.metric(label, candidatePools)
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
          quoteCurrencyUsdPrice,
          nativeCurrencyUsdPrice,
          signal,
        })
        const duration = Math.floor(performance.now() - startTime)

        if (trackPerf) {
          tracker.log(`[PERF] ${key} duration:${duration}ms`, {
            chainId: currency.chainId,
            label: key,
            duration,
          })
        }

        if (!res) {
          return undefined
        }
        SmartRouter.logger.metric(
          label,
          res.inputAmount.toExact(),
          res.inputAmount.currency.symbol,
          '->',
          res.outputAmount.toExact(),
          res.outputAmount.currency.symbol,
          res.routes,
        )
        SmartRouter.logger.log(label, res)
        const result: T = {
          ...res,
          blockNumber,
        }
        return result
      },
      enabled: !!(amount && currency && candidatePools && !loading && deferQuotient && enabled),
      refetchOnWindowFocus: false,
      placeholderData: keepPreviousDataRef.current ? keepPreviousData : undefined,
      retry: false,
      staleTime: autoRevalidate && amount?.currency.chainId ? POOLS_NORMAL_REVALIDATE[amount.currency.chainId] : 0,
      refetchInterval:
        autoRevalidate && amount?.currency.chainId ? POOLS_NORMAL_REVALIDATE[amount?.currency?.chainId] : 0,
    })

    useEffect(() => {
      if (!keepPreviousDataRef.current && trade) {
        keepPreviousDataRef.current = true
      }
    }, [trade, keepPreviousDataRef])

    const isValidating = fetchStatus === 'fetching'
    const isLoading = status === 'pending' || isPlaceholderData

    const refresh = useCallback(async () => {
      await refreshPools()
      await queryClient.invalidateQueries({
        queryKey: [key],
        refetchType: 'none',
      })
      refetch()
    }, [refreshPools, queryClient, refetch])

    return {
      refresh,
      trade,
      isLoading: isLoading || loading,
      isStale: trade?.blockNumber !== blockNumber,
      error: error as Error | undefined,
      syncing:
        syncing || isValidating || (amount?.quotient?.toString() !== deferQuotient && deferQuotient !== undefined),
    }
  }
}

function createQuoteProvider({ gasLimit, signal }: CreateQuoteProviderParams) {
  const onChainProvider = createViemPublicClientGetter({ transportSignal: signal })
  return SmartRouter.createQuoteProvider({ onChainProvider, gasLimit })
}

function createOffChainQuoteProvider() {
  return SmartRouter.createOffChainQuoteProvider()
}

export const useBestAMMTradeFromOffchain = bestTradeHookFactory<SmartRouterTrade<TradeType>>({
  key: 'useBestAMMTradeFromOffchain',
  useCommonPools: useCommonPoolsWithTicks,
  useGetBestTrade: createSimpleUseGetBestTradeHook(SmartRouter.getBestTrade),
  createQuoteProvider: createOffChainQuoteProvider,
})

export const useBestAMMTradeFromQuoter = bestTradeHookFactory<SmartRouterTrade<TradeType>>({
  key: 'useBestAMMTradeFromQuoter',
  useCommonPools: useCommonPoolsLite,
  createQuoteProvider,
  useGetBestTrade: createSimpleUseGetBestTradeHook(SmartRouter.getBestTrade),
  // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
  quoterOptimization: false,
})

type V4GetBestTradeReturnType = Omit<Exclude<Awaited<ReturnType<typeof V4Router.getBestTrade>>, undefined>, 'graph'>

function createUseWorkerGetBestTradeOffchain() {
  return function useWorkerGetBestTradeOffchain(): (
    ...args: GetBestTradeParams
  ) => Promise<V4GetBestTradeReturnType | null> {
    const worker = useGlobalWorker()

    return useCallback(
      async (
        amount,
        currency,
        tradeType,
        { maxHops, allowedPoolTypes, gasPriceWei, signal, poolProvider, maxSplits },
      ) => {
        if (!worker) {
          throw new Error('Quote worker not initialized')
        }
        const candidatePools = await poolProvider.getCandidatePools({
          currencyA: amount.currency,
          currencyB: currency,
          protocols: allowedPoolTypes,
        })
        try {
          const result = await worker.getBestTradeOffchain({
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
            candidatePools: candidatePools.map(SmartRouter.Transformer.serializePool),
            signal,
          })
          if (!result) {
            throw new NoValidRouteError()
          }
          return V4Router.Transformer.parseTrade(currency.chainId, result) ?? null
        } catch (e) {
          console.error(e)
          throw new NoValidRouteError()
        }
      },
      [worker],
    )
  }
}

export const useBestAMMTradeFromOffchainQuoter = bestTradeHookFactory<V4Router.V4TradeWithoutGraph<TradeType>>({
  key: 'useBestAMMTradeFromOffchainQuoter',
  useCommonPools: useCommonPoolsOnChain,
  createQuoteProvider,
  useGetBestTrade: createUseWorkerGetBestTradeOffchain(),
})

export function useBestTradeFromApi({
  baseCurrency,
  amount,
  currency,
  enabled,
  maxHops,
  maxSplits,
  stableSwap,
  trackPerf,
  tradeType = TradeType.EXACT_INPUT,
  v2Swap,
  v3Swap,
}: Options) {
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
    if (types.length === 0) {
      return undefined
    }
    return types
  }, [v2Swap, v3Swap, stableSwap])

  useTradeApiPrefetch({
    currencyA: baseCurrency,
    currencyB: currency,
    enabled,
    poolTypes,
  })

  const deferQuotientRaw = useDeferredValue(amount?.quotient?.toString())
  const deferQuotient = useDebounce(deferQuotientRaw, 500)
  const { address } = useAccount()
  const { gasPrice } = useFeeDataWithGasPrice()

  const [isXEnabled] = useUserXEnable()

  const previousEnabled = usePreviousValue(enabled)

  return useQuery({
    enabled: !!(amount && currency && deferQuotient && enabled),
    refetchInterval: POOLS_FAST_REVALIDATE[currency?.chainId as keyof typeof POOLS_FAST_REVALIDATE] ?? 10_000,
    queryKey: [
      'quote-api',
      address,
      currency?.chainId,
      amount?.currency?.symbol,
      currency?.symbol,
      tradeType,
      deferQuotient,
      maxHops,
      maxSplits,
      poolTypes,
    ] as const,
    queryFn: async ({ signal, queryKey }) => {
      const [key] = queryKey
      if (!amount || !amount.currency || !currency || !deferQuotient) {
        throw new Error('Invalid amount or currency')
      }

      const startTime = performance.now()

      const body = getRequestBody({
        amount,
        quoteCurrency: currency,
        tradeType,
        amm: { maxHops, maxSplits, poolTypes, gasPriceWei: gasPrice },
        x: {
          useSyntheticQuotes: true,
          swapper: address,
        },
      })
      const serverRes = await fetch(`${QUOTING_API}${isXEnabled ? '?mock=true' : ''}`, {
        method: 'POST',
        signal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const serializedRes = await serverRes.json()

      const result = parseQuoteResponse(serializedRes, {
        chainId: currency.chainId,
        currencyIn: amount.currency,
        currencyOut: currency,
        tradeType,
      })

      const duration = Math.floor(performance.now() - startTime)

      if (trackPerf) {
        tracker.log(`[PERF] ${key} duration:${duration}ms`, {
          chainId: currency.chainId,
          label: key,
          duration,
        })
      }

      return result
    },
    placeholderData: (previousData, previousQuery) => {
      const queryKey = previousQuery?.queryKey

      if (!queryKey) return undefined
      if (!previousEnabled) return undefined

      return previousData
    },
  })
}

export const useBestAMMTradeFromQuoterApi = bestTradeHookFactory<V4Router.V4TradeWithoutGraph<TradeType>>({
  key: 'useBestAMMTradeFromPriceAPI',
  useCommonPools: useCommonPoolsLite,
  createQuoteProvider,
  useGetBestTrade: createSimpleUseGetBestTradeHook(
    async (amount, currency, tradeType, { maxHops, maxSplits, allowedPoolTypes, signal }) => {
      const serverRes = await fetch(`${QUOTING_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
        body: JSON.stringify({
          chainId: currency.chainId,
          currency: SmartRouter.Transformer.serializeCurrency(currency),
          tradeType,
          amount: {
            currency: SmartRouter.Transformer.serializeCurrency(amount.currency),
            value: amount.quotient.toString(),
          },
          maxHops,
          maxSplits,
          poolTypes: allowedPoolTypes,
        }),
      })
      const serializedRes = await serverRes.json()
      return parseAMMPriceResponse(currency.chainId, serializedRes)
    },
  ),
  // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
  quoterOptimization: false,
})

function createUseWorkerGetBestTrade() {
  return function useWorkerGetBestTrade(): typeof SmartRouter.getBestTrade {
    const worker = useGlobalWorker()

    return useCallback(
      async (
        amount,
        currency,
        tradeType,
        {
          maxHops,
          maxSplits,
          allowedPoolTypes,
          poolProvider,
          gasPriceWei,
          quoteProvider,
          nativeCurrencyUsdPrice,
          quoteCurrencyUsdPrice,
          signal,
        },
      ) => {
        if (!worker) {
          throw new Error('Quote worker not initialized')
        }
        const candidatePools = await poolProvider.getCandidatePools({
          currencyA: amount.currency,
          currencyB: currency,
          protocols: allowedPoolTypes,
        })

        const quoterConfig = (quoteProvider as ReturnType<typeof SmartRouter.createQuoteProvider>)?.getConfig?.()
        const result = await worker.getBestTrade({
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
          onChainQuoterGasLimit: quoterConfig?.gasLimit?.toString(),
          quoteCurrencyUsdPrice,
          nativeCurrencyUsdPrice,
          signal,
        })
        return SmartRouter.Transformer.parseTrade(currency.chainId, result as any)
      },
      [worker],
    )
  }
}

export const useBestAMMTradeFromQuoterWorker = bestTradeHookFactory<SmartRouterTrade<TradeType>>({
  key: 'useBestAMMTradeFromQuoterWorker',
  useCommonPools: useCommonPoolsLite,
  createQuoteProvider,
  useGetBestTrade: createUseWorkerGetBestTrade(),
  // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
  quoterOptimization: false,
})

function createQuoteProvider2({ gasLimit, signal }: CreateQuoteProviderParams) {
  const onChainProvider = createViemPublicClientGetter({ transportSignal: signal })
  return SmartRouter.createQuoteProvider({
    onChainProvider,
    gasLimit,
    multicallConfigs: {
      ...BATCH_MULTICALL_CONFIGS,
      [ChainId.BSC]: {
        ...BATCH_MULTICALL_CONFIGS[ChainId.BSC],
        defaultConfig: {
          gasLimitPerCall: 1_000_000,
        },
      },
    },
  })
}

export const useBestAMMTradeFromQuoterWorker2 = bestTradeHookFactory<SmartRouterTrade<TradeType>>({
  key: 'useBestAMMTradeFromQuoterWorker2',
  useCommonPools: useCommonPoolsLite,
  createQuoteProvider: createQuoteProvider2,
  useGetBestTrade: createUseWorkerGetBestTrade(),
  // Since quotes are fetched on chain, which relies on network IO, not calculated offchain, we don't need to further optimize
  quoterOptimization: false,
})

type PrefetchParams = {
  currencyA?: Currency | null
  currencyB?: Currency | null
  poolTypes?: PoolType[]
  enabled?: boolean
}

function getCurrencyIdentifierForApi(currency: Currency) {
  return currency.isNative ? zeroAddress : currency.address
}

function useTradeApiPrefetch({ currencyA, currencyB, poolTypes, enabled = true }: PrefetchParams) {
  return useQuery({
    enabled: !!(currencyA && currencyB && poolTypes?.length && enabled),
    queryKey: ['quote-api-prefetch', currencyA?.chainId, currencyA?.symbol, currencyB?.symbol, poolTypes] as const,
    queryFn: async ({ signal }) => {
      if (!currencyA || !currencyB || !poolTypes?.length) {
        throw new Error('Invalid prefetch params')
      }

      const serverRes = await fetch(
        `${QUOTING_API_PREFIX}/_pools/${currencyA.chainId}/${getCurrencyIdentifierForApi(
          currencyA,
        )}/${getCurrencyIdentifierForApi(currencyB)}?${qs.stringify({ protocols: poolTypes.map(getPoolTypeKey) })}`,
        {
          method: 'GET',
          signal,
        },
      )
      const res = await serverRes.json()
      if (!res.success) {
        throw new Error(res.message)
      }
      return res
    },
    staleTime: currencyA?.chainId ? POOLS_FAST_REVALIDATE[currencyA.chainId] : 0,
    refetchInterval: currencyA?.chainId ? POOLS_FAST_REVALIDATE[currencyA.chainId] : 0,
  })
}
