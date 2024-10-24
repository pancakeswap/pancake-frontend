import { ChainId } from '@pancakeswap/chains'
import { Currency, CurrencyAmount, ERC20Token, Native, Percent, TradeType } from '@pancakeswap/sdk'
import { ADDRESS_ZERO, Tick } from '@pancakeswap/v3-sdk'
import { Address } from 'viem'
import { Pool, PoolType, Route, SmartRouterTrade, StablePool, V2Pool, V3Pool, V4ClPool } from '../types'
import { isStablePool, isV2Pool, isV3Pool, isV4ClPool } from './pool'

const ONE_HUNDRED = 100n

export type SerializedTick = {
  index: number
  liquidityGross: string
  liquidityNet: string
}

export interface SerializedCurrency {
  address: Address
  decimals: number
  symbol: string
}

export interface SerializedCurrencyAmount {
  currency: SerializedCurrency
  value: string
}

export interface SerializedV2Pool extends Omit<V2Pool, 'reserve0' | 'reserve1'> {
  reserve0: SerializedCurrencyAmount
  reserve1: SerializedCurrencyAmount
}

export interface SerializedV3Pool
  extends Omit<
    V3Pool,
    | 'token0'
    | 'token1'
    | 'liquidity'
    | 'sqrtRatioX96'
    | 'token0ProtocolFee'
    | 'token1ProtocolFee'
    | 'ticks'
    | 'reserve0'
    | 'reserve1'
  > {
  token0: SerializedCurrency
  token1: SerializedCurrency
  liquidity: string
  sqrtRatioX96: string
  token0ProtocolFee: string
  token1ProtocolFee: string
  reserve0?: SerializedCurrencyAmount
  reserve1?: SerializedCurrencyAmount
  ticks?: SerializedTick[]
}

export interface SerializedV4ClPool
  extends Omit<V4ClPool, 'currency0' | 'currency1' | 'liquidity' | 'sqrtRatioX96' | 'ticks' | 'reserve0' | 'reserve1'> {
  currency0: SerializedCurrency
  currency1: SerializedCurrency
  liquidity: string
  sqrtRatioX96: string
  reserve0?: SerializedCurrencyAmount
  reserve1?: SerializedCurrencyAmount
  ticks?: SerializedTick[]
}

export interface SerializedStablePool extends Omit<StablePool, 'balances' | 'amplifier' | 'fee'> {
  balances: SerializedCurrencyAmount[]
  amplifier: string
  fee: string
}

export type SerializedPool = SerializedV2Pool | SerializedV3Pool | SerializedStablePool | SerializedV4ClPool

export interface SerializedRoute
  extends Omit<Route, 'pools' | 'path' | 'input' | 'output' | 'inputAmount' | 'outputAmount'> {
  pools: SerializedPool[]
  path: SerializedCurrency[]
  inputAmount: SerializedCurrencyAmount
  outputAmount: SerializedCurrencyAmount
}

export interface SerializedTrade
  extends Omit<
    SmartRouterTrade<TradeType>,
    'inputAmount' | 'outputAmount' | 'gasEstimate' | 'gasEstimateInUSD' | 'routes'
  > {
  inputAmount: SerializedCurrencyAmount
  outputAmount: SerializedCurrencyAmount
  gasEstimate: string
  gasEstimateInUSD?: SerializedCurrencyAmount
  routes: SerializedRoute[]
}

export function serializeCurrency(currency: Currency): SerializedCurrency {
  return {
    address: currency.isNative ? ADDRESS_ZERO : currency.wrapped.address,
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

export function serializeTick(tick: Tick): SerializedTick {
  return {
    index: tick.index,
    liquidityNet: String(tick.liquidityNet),
    liquidityGross: String(tick.liquidityGross),
  }
}

export function serializePool(pool: Pool): SerializedPool {
  if (isV2Pool(pool)) {
    return {
      ...pool,
      reserve0: serializeCurrencyAmount(pool.reserve0),
      reserve1: serializeCurrencyAmount(pool.reserve1),
    }
  }
  if (isV3Pool(pool)) {
    return {
      ...pool,
      token0: serializeCurrency(pool.token0),
      token1: serializeCurrency(pool.token1),
      liquidity: pool.liquidity.toString(),
      sqrtRatioX96: pool.sqrtRatioX96.toString(),
      token0ProtocolFee: pool.token0ProtocolFee.toFixed(0),
      token1ProtocolFee: pool.token1ProtocolFee.toFixed(0),
      ticks: pool.ticks?.map(serializeTick),
      reserve0: pool.reserve0 && serializeCurrencyAmount(pool.reserve0),
      reserve1: pool.reserve1 && serializeCurrencyAmount(pool.reserve1),
    }
  }
  if (isStablePool(pool)) {
    return {
      ...pool,
      balances: pool.balances.map(serializeCurrencyAmount),
      amplifier: pool.amplifier.toString(),
      fee: pool.fee.toSignificant(6),
    }
  }
  if (isV4ClPool(pool)) {
    return {
      ...pool,
      currency0: serializeCurrency(pool.currency0),
      currency1: serializeCurrency(pool.currency1),
      liquidity: pool.liquidity.toString(),
      sqrtRatioX96: pool.sqrtRatioX96.toString(),
      ticks: pool.ticks?.map(serializeTick),
      reserve0: pool.reserve0 && serializeCurrencyAmount(pool.reserve0),
      reserve1: pool.reserve1 && serializeCurrencyAmount(pool.reserve1),
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
    gasEstimateInUSD: trade.gasEstimateInUSD && serializeCurrencyAmount(trade.gasEstimateInUSD),
  }
}

export function parseTick(tick: SerializedTick): Tick {
  return new Tick(tick)
}

export function parseCurrency(chainId: ChainId, currency: SerializedCurrency): Currency {
  if (currency.address === ADDRESS_ZERO) {
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
      liquidity: BigInt(pool.liquidity),
      sqrtRatioX96: BigInt(pool.sqrtRatioX96),
      token0ProtocolFee: new Percent(pool.token0ProtocolFee, ONE_HUNDRED),
      token1ProtocolFee: new Percent(pool.token1ProtocolFee, ONE_HUNDRED),
      ticks: pool.ticks?.map(parseTick),
      reserve0: pool.reserve0 && parseCurrencyAmount(chainId, pool.reserve0),
      reserve1: pool.reserve1 && parseCurrencyAmount(chainId, pool.reserve1),
    }
  }
  if (pool.type === PoolType.STABLE) {
    return {
      ...pool,
      balances: pool.balances.map((b) => parseCurrencyAmount(chainId, b)),
      amplifier: BigInt(pool.amplifier),
      fee: new Percent(parseFloat(pool.fee) * 1000000, ONE_HUNDRED * 1000000n),
    }
  }
  if (pool.type === PoolType.V4CL) {
    return {
      ...pool,
      currency0: parseCurrency(chainId, pool.currency0),
      currency1: parseCurrency(chainId, pool.currency1),
      liquidity: BigInt(pool.liquidity),
      sqrtRatioX96: BigInt(pool.sqrtRatioX96),
      ticks: pool.ticks?.map(parseTick),
      reserve0: pool.reserve0 && parseCurrencyAmount(chainId, pool.reserve0),
      reserve1: pool.reserve1 && parseCurrencyAmount(chainId, pool.reserve1),
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
    gasEstimate: trade.gasEstimate ? BigInt(trade.gasEstimate) : 0n,
    gasEstimateInUSD: trade.gasEstimateInUSD && parseCurrencyAmount(chainId, trade.gasEstimateInUSD),
  }
}
