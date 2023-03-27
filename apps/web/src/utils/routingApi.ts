import {
  SmartRouter,
  Pool,
  V2Pool,
  V3Pool,
  StablePool,
  PoolType,
  SmartRouterTrade,
  Route,
} from '@pancakeswap/smart-router/evm'
import { ChainId, CurrencyAmount, Currency, ERC20Token, Native, JSBI, TradeType } from '@pancakeswap/sdk'
import { AddressZero } from '@ethersproject/constants'

interface SerializedCurrency {
  address: string
  decimals: number
  symbol: string
}

interface SerializedCurrencyAmount {
  currency: SerializedCurrency
  value: string
}

interface SerializedV2Pool extends Omit<V2Pool, 'reserve0' | 'reserve1'> {
  reserve0: SerializedCurrencyAmount
  reserve1: SerializedCurrencyAmount
}

interface SerializedV3Pool extends Omit<V3Pool, 'token0' | 'token1' | 'liquidity' | 'sqrtRatioX96'> {
  token0: SerializedCurrency
  token1: SerializedCurrency
  liquidity: string
  sqrtRatioX96: string
}

interface SerializedStablePool extends Omit<StablePool, 'balances' | 'amplifier'> {
  balances: SerializedCurrencyAmount[]
  amplifier: string
}

type SerializedPool = SerializedV2Pool | SerializedV3Pool | SerializedStablePool

interface SerializedRoute extends Omit<Route, 'pools' | 'path' | 'input' | 'output' | 'inputAmount' | 'outputAmount'> {
  pools: SerializedPool[]
  path: SerializedCurrency[]
  inputAmount: SerializedCurrencyAmount
  outputAmount: SerializedCurrencyAmount
}

interface SerializedTrade
  extends Omit<
    SmartRouterTrade<TradeType>,
    'inputAmount' | 'outputAmount' | 'gasEstimate' | 'gasEstimateInUSD' | 'routes'
  > {
  inputAmount: SerializedCurrencyAmount
  outputAmount: SerializedCurrencyAmount
  gasEstimate: string
  gasEstimateInUSD: SerializedCurrencyAmount
  routes: SerializedRoute[]
}

export function serializeCurrency(currency: Currency): SerializedCurrency {
  return {
    address: currency.isNative ? AddressZero : currency.wrapped.address,
    decimals: currency.decimals,
    symbol: currency.symbol,
  }
}

export function serializeCurrencyAmount(amount: CurrencyAmount<Currency>): SerializedCurrencyAmount {
  return {
    currency: serializeCurrency(amount.currency),
    value: amount.quotient.toString(),
  }
}

export function serializePool(pool: Pool): SerializedPool {
  if (SmartRouter.isV2Pool(pool)) {
    return {
      ...pool,
      reserve0: serializeCurrencyAmount(pool.reserve0),
      reserve1: serializeCurrencyAmount(pool.reserve1),
    }
  }
  if (SmartRouter.isV3Pool(pool)) {
    return {
      ...pool,
      token0: serializeCurrency(pool.token0),
      token1: serializeCurrency(pool.token1),
      liquidity: pool.liquidity.toString(),
      sqrtRatioX96: pool.sqrtRatioX96.toString(),
    }
  }
  if (SmartRouter.isStablePool(pool)) {
    return {
      ...pool,
      balances: pool.balances.map(serializeCurrencyAmount),
      amplifier: pool.amplifier.toString(),
    }
  }
  throw new Error('Cannot serialize unsupoorted pool')
}

export function serializeRoute(route: Route): SerializedRoute {
  return {
    ...route,
    pools: route.pools.map(serializePool),
    path: route.path.map(serializeCurrency),
    inputAmount: serializeCurrencyAmount(route.inputAmount),
    outputAmount: serializeCurrencyAmount(route.outputAmount),
  }
}

export function serializeTrade(trade: SmartRouterTrade<TradeType>): SerializedTrade {
  return {
    ...trade,
    inputAmount: serializeCurrencyAmount(trade.inputAmount),
    outputAmount: serializeCurrencyAmount(trade.outputAmount),
    routes: trade.routes.map(serializeRoute),
    gasEstimate: trade.gasEstimate.toString(),
    gasEstimateInUSD: serializeCurrencyAmount(trade.gasEstimateInUSD),
  }
}

export function parseCurrency(chainId: ChainId, currency: SerializedCurrency): Currency {
  if (currency.address === AddressZero) {
    return Native.onChain(chainId)
  }
  const { address, decimals, symbol } = currency
  return new ERC20Token(chainId, address, decimals, symbol)
}

export function parseCurrencyAmount(chainId: ChainId, amount: SerializedCurrencyAmount): CurrencyAmount<Currency> {
  return CurrencyAmount.fromRawAmount(parseCurrency(chainId, amount.currency), amount.value)
}

export function parsePool(chainId: ChainId, pool: SerializedPool): Pool {
  if (pool.type === PoolType.V2) {
    return {
      ...pool,
      reserve0: parseCurrencyAmount(chainId, pool.reserve0),
      reserve1: parseCurrencyAmount(chainId, pool.reserve1),
    }
  }
  if (pool.type === PoolType.V3) {
    return {
      ...pool,
      token0: parseCurrency(chainId, pool.token0),
      token1: parseCurrency(chainId, pool.token1),
      liquidity: JSBI.BigInt(pool.liquidity),
      sqrtRatioX96: JSBI.BigInt(pool.sqrtRatioX96),
    }
  }
  if (pool.type === PoolType.STABLE) {
    return {
      ...pool,
      balances: pool.balances.map((b) => parseCurrencyAmount(chainId, b)),
      amplifier: JSBI.BigInt(pool.amplifier),
    }
  }

  throw new Error('Cannot parse unsupoorted pool')
}

export function parseRoute(chainId: ChainId, route: SerializedRoute): Route {
  return {
    ...route,
    pools: route.pools.map((p) => parsePool(chainId, p)),
    path: route.path.map((c) => parseCurrency(chainId, c)),
    inputAmount: parseCurrencyAmount(chainId, route.inputAmount),
    outputAmount: parseCurrencyAmount(chainId, route.outputAmount),
  }
}

export function parseTrade(chainId: ChainId, trade: SerializedTrade): SmartRouterTrade<TradeType> {
  return {
    ...trade,
    inputAmount: parseCurrencyAmount(chainId, trade.inputAmount),
    outputAmount: parseCurrencyAmount(chainId, trade.outputAmount),
    routes: trade.routes.map((r) => parseRoute(chainId, r)),
    gasEstimate: JSBI.BigInt(trade.gasEstimate),
    gasEstimateInUSD: parseCurrencyAmount(chainId, trade.gasEstimateInUSD),
  }
}
