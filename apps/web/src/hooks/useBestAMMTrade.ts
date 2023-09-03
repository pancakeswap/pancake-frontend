import { useDebounce, usePropsChanged } from '@pancakeswap/hooks'
import { ChainId, Currency, CurrencyAmount, Native, Pair, Percent, Token, TradeType, Route as V2Route, ZERO_PERCENT } from '@pancakeswap/sdk'
import {
  BATCH_MULTICALL_CONFIGS,
  PoolType,
  QuoteProvider,
  Route,
  SmartRouter,
  SmartRouterTrade,
  StablePool,
  V2Pool,
  V3Pool,
} from '@pancakeswap/smart-router/evm'
import { MixedRouteSDK, Pool as PoolV3, Route as V3Route } from '@pancakeswap/v3-sdk'
import { useQuery } from '@tanstack/react-query'
import { useDeferredValue, useEffect, useMemo, useRef } from 'react'

import { QUOTING_API } from 'config/constants/endpoints'
import { POOLS_NORMAL_REVALIDATE } from 'config/pools'
import { useIsWrapping } from 'hooks/useWrapCallback'
import { useCurrentBlock } from 'state/block/hooks'
import { useFeeDataWithGasPrice } from 'state/user/hooks'
import { getViemClients } from 'utils/viem'
import { publicClient } from 'utils/wagmi'
import { worker, worker2 } from 'utils/worker'

import { GetQuoteArgs } from 'views/Swap/V3Swap/hooks/swapRoutingAPIArguments'
import { ClassicTrade, QuoteState, TradeResult } from 'views/Swap/V3Swap/utils/types'
import {
  CommonPoolsParams,
  PoolsWithState,
  useCommonPoolsLite,
  useCommonPools as useCommonPoolsWithTicks,
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
  queryArgs: GetQuoteArgs
}

interface useBestAMMTradeOptions extends Options {
  type?: 'offchain' | 'quoter' | 'auto' | 'api'
}

export function useBestAMMTrade({ type = 'quoter', ...params }: useBestAMMTradeOptions) {
  const { amount, baseCurrency, currency, autoRevalidate, enabled = true, queryArgs } = params
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
    queryArgs
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
      ] as any,
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
        const tradeResult = await transformRoutesToTrade(queryArgs, tradeType, res, blockNumber)
        return {
          res: {
          ...res,
            blockNumber
          },
          trade: tradeResult
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
      trade: trade?.res,
      trade2: trade?.trade,
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

export enum SwapRouterNativeAssets {
  MATIC = 'MATIC',
  BNB = 'BNB',
  AVAX = 'AVAX',
  ETH = 'ETH',
}

function getTradeCurrencies(args: GetQuoteArgs): [Currency, Currency] {
  const {
    tokenInAddress,
    tokenInChainId,
    tokenInDecimals,
    tokenInSymbol,
    tokenOutAddress,
    tokenOutChainId,
    tokenOutDecimals,
    tokenOutSymbol,
  } = args

  const tokenInIsNative = Object.values(SwapRouterNativeAssets).includes(tokenInAddress as SwapRouterNativeAssets)
  const tokenOutIsNative = Object.values(SwapRouterNativeAssets).includes(tokenOutAddress as SwapRouterNativeAssets)

  const currencyIn = tokenInIsNative
    ? Native.onChain(tokenInChainId)
    : new Token(tokenInChainId, tokenInAddress as any, tokenInDecimals, tokenInSymbol )
  const currencyOut = tokenOutIsNative
  ? Native.onChain(tokenOutChainId)
  : new Token(tokenOutChainId, tokenOutAddress as any, tokenOutDecimals, tokenOutSymbol )

  return [currencyIn.isNative ? currencyIn.wrapped : currencyIn, currencyOut]
}
interface RouteResult {
  routev3: V3Route<Currency, Currency> | null
  routev2: V2Route<Currency, Currency> | null
  mixedRoute: any | null
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
}

function parseToken({ address, chainId, decimals, symbol }: any): Token {
  return new Token(chainId, address, parseInt(decimals.toString()), symbol)
}

function parsePool({ fee, sqrtRatioX96, liquidity, tick, token0, token1 }: V3Pool): PoolV3 {
  return new PoolV3(
    parseToken(token0),
    parseToken(token1),
    fee,
    sqrtRatioX96,
    liquidity,
    parseInt(tick.toString())
  )
}

const parsePair = ({ reserve0, reserve1 }: V2Pool): Pair =>
  new Pair(
    CurrencyAmount.fromRawAmount(reserve0.currency.wrapped, reserve0.quotient),
    CurrencyAmount.fromRawAmount(reserve1.currency.wrapped, reserve1.quotient)
  )

  const parsePoolOrPair = (pool: V3Pool | V2Pool): PoolV3 | Pair => {
    return pool.type === PoolType.V3 ? parsePool(pool) : parsePair(pool)
  }
  

  function isVersionedRoute<T extends V2Pool | V3Pool | StablePool>(
    type: T['type'],
    route: (V3Pool| V2Pool | StablePool)[]
  ): route is T[] {
    return route.every((pool) => pool.type === type)
  }
export function computeRoutes(
  currencyIn: Currency,
  currencyOut: Currency,
  routes: Route[]
): RouteResult[] | undefined {
  if (routes.length === 0) return []

  // const tokenIn = routes[0]?.[0]?.tokenIn
  // const tokenOut = routes[0]?.[routes[0]?.length - 1]?.tokenOut
  // if (!tokenIn || !tokenOut) throw new Error('Expected both tokenIn and tokenOut to be present')

  try {
    return routes.map((route: Route) => {

      const isOnlyV2 = isVersionedRoute<V2Pool>(PoolType.V2, route.pools)
      const isOnlyV3 = isVersionedRoute<V3Pool>(PoolType.V3, route.pools)
     
      return {
        routev3: isOnlyV3 ? new V3Route((route.pools as V3Pool[]).map(parsePool), currencyIn, currencyOut) : null,
        routev2: isOnlyV2 ? new V2Route((route.pools as V2Pool[]).map(parsePair), currencyIn, currencyOut) : null,
        mixedRoute:
          !isOnlyV3 && !isOnlyV2 ? new MixedRouteSDK((route.pools as (PoolV3[] | Pair[])).map(parsePoolOrPair), currencyIn, currencyOut) : null,
        inputAmount: route.inputAmount,
        outputAmount: route.outputAmount,
      }
    })
  } catch (e) {
    console.error('Error computing routes', e)
    return []
  }
}

function getClassicTradeDetails(
  currencyIn: Currency,
  currencyOut: Currency,
  data:  SmartRouterTrade<TradeType>,
  block: number
): {
  gasUseEstimate?: number
  gasUseEstimateUSD?: number
  blockNumber?: string
  routes?: RouteResult[]
} {
  return {
    gasUseEstimate: data?.gasEstimate ? Number(data.gasEstimate.toString()) : undefined,
    gasUseEstimateUSD: data?.gasEstimateInUSD ? data.gasEstimateInUSD.numerator : undefined,
    blockNumber: block ? block.toString() : undefined,
    routes: data ? computeRoutes(currencyIn, currencyOut, data.routes) : undefined,
  }
}

export async function transformRoutesToTrade(
  args: GetQuoteArgs,
  tradeType: TradeType,
  data: SmartRouterTrade<TradeType>,
  block: number
): Promise<TradeResult | null> {
  if (!data || !args) return null

  const [currencyIn, currencyOut] = getTradeCurrencies(args)
  const { gasUseEstimateUSD, routes, blockNumber, gasUseEstimate } = getClassicTradeDetails(
    currencyIn,
    currencyOut,
    data,
    block
  )
  // // Some sus javascript float math but it's ok because its just an estimate for display purposes
  // const usdCostPerGas = gasUseEstimateUSD && gasUseEstimate ? gasUseEstimateUSD / gasUseEstimate : undefined
  // const approveInfo = await getApproveInfo(account, currencyIn, amount, usdCostPerGas)

  const inputTax = new Percent(3, 100)
  const outputTax = ZERO_PERCENT

  const classicTrade = new ClassicTrade({
    v2Routes:
      routes
        ?.filter((r): r is RouteResult & { routev2: NonNullable<RouteResult['routev2']> } => r.routev2 !== null)
        .map(({ routev2, inputAmount, outputAmount }) => ({
          routev2,
          inputAmount,
          outputAmount,
        })) ?? [],
    v3Routes:
      routes
        ?.filter((r): r is RouteResult & { routev3: NonNullable<RouteResult['routev3']> } => r.routev3 !== null)
        .map(({ routev3, inputAmount, outputAmount }) => ({
          routev3,
          inputAmount,
          outputAmount,
        })) ?? [],
    mixedRoutes:
      routes
        ?.filter(
          (r): r is RouteResult & { mixedRoute: NonNullable<RouteResult['mixedRoute']> } => r.mixedRoute !== null
        )
        .map(({ mixedRoute, inputAmount, outputAmount }) => ({
          mixedRoute,
          inputAmount,
          outputAmount,
        })) ?? [],
    tradeType,
    gasUseEstimateUSD,
    gasUseEstimate,
    blockNumber,
    inputTax,
    outputTax,
  })

  return { state: QuoteState.SUCCESS, trade: classicTrade }
}