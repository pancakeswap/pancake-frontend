import { TradeType } from '@pancakeswap/swap-sdk-core'
import { ChainId } from '@pancakeswap/chains'

import {
  SerializedCurrency,
  SerializedCurrencyAmount,
  SerializedPool,
  parseCurrency,
  parseCurrencyAmount,
  parsePool,
  serializeCurrency,
  serializeCurrencyAmount,
  serializePool,
} from '../v3-router/utils/transformer'
import { V4Route, V4Trade } from './types'

export interface SerializedV4Route
  extends Omit<
    V4Route,
    | 'pools'
    | 'path'
    | 'input'
    | 'output'
    | 'inputAmount'
    | 'outputAmount'
    | 'gasCost'
    | 'gasCostInBase'
    | 'gasCostInQuote'
    | 'inputAmountWithGasAdjusted'
    | 'outputAmountWithGasAdjusted'
  > {
  pools: SerializedPool[]
  path: SerializedCurrency[]
  inputAmount: SerializedCurrencyAmount
  outputAmount: SerializedCurrencyAmount
  gasCost: string
  gasCostInBase: SerializedCurrencyAmount
  gasCostInQuote: SerializedCurrencyAmount
  inputAmountWithGasAdjusted: SerializedCurrencyAmount
  outputAmountWithGasAdjusted: SerializedCurrencyAmount
}

export interface SerializedV4Trade
  extends Omit<
    V4Trade<TradeType>,
    | 'inputAmount'
    | 'outputAmount'
    | 'gasEstimate'
    | 'gasCostInQuote'
    | 'routes'
    | 'graph'
    | 'gasCostInBase'
    | 'inputAmountWithGasAdjusted'
    | 'outputAmountWithGasAdjusted'
  > {
  inputAmount: SerializedCurrencyAmount
  outputAmount: SerializedCurrencyAmount
  gasEstimate: string
  routes: SerializedV4Route[]
  gasCostInBase: SerializedCurrencyAmount
  gasCostInQuote: SerializedCurrencyAmount
  inputAmountWithGasAdjusted: SerializedCurrencyAmount
  outputAmountWithGasAdjusted: SerializedCurrencyAmount
}

export function serializeRoute(route: V4Route): SerializedV4Route {
  return {
    ...route,
    pools: route.pools.map(serializePool),
    path: route.path.map(serializeCurrency),
    inputAmount: serializeCurrencyAmount(route.inputAmount),
    outputAmount: serializeCurrencyAmount(route.outputAmount),
    gasCost: String(route.gasCost),
    gasCostInBase: serializeCurrencyAmount(route.gasCostInBase),
    gasCostInQuote: serializeCurrencyAmount(route.gasCostInQuote),
    inputAmountWithGasAdjusted: serializeCurrencyAmount(route.inputAmountWithGasAdjusted),
    outputAmountWithGasAdjusted: serializeCurrencyAmount(route.outputAmountWithGasAdjusted),
  }
}

export function parseRoute(chainId: ChainId, route: SerializedV4Route): V4Route {
  return {
    ...route,
    pools: route.pools.map((p) => parsePool(chainId, p)),
    path: route.path.map((c) => parseCurrency(chainId, c)),
    inputAmount: parseCurrencyAmount(chainId, route.inputAmount),
    outputAmount: parseCurrencyAmount(chainId, route.outputAmount),
    gasCost: BigInt(route.gasCost),
    gasCostInBase: parseCurrencyAmount(chainId, route.gasCostInBase),
    gasCostInQuote: parseCurrencyAmount(chainId, route.gasCostInQuote),
    inputAmountWithGasAdjusted: parseCurrencyAmount(chainId, route.inputAmountWithGasAdjusted),
    outputAmountWithGasAdjusted: parseCurrencyAmount(chainId, route.outputAmountWithGasAdjusted),
  }
}

export function serializeTrade(trade: V4Trade<TradeType>): SerializedV4Trade {
  const { graph: _graph, ...rest } = trade
  return {
    ...rest,
    inputAmount: serializeCurrencyAmount(trade.inputAmount),
    outputAmount: serializeCurrencyAmount(trade.outputAmount),
    routes: trade.routes.map(serializeRoute),
    gasEstimate: trade.gasEstimate.toString(),
    gasCostInBase: serializeCurrencyAmount(trade.gasCostInBase),
    gasCostInQuote: serializeCurrencyAmount(trade.gasCostInQuote),
    inputAmountWithGasAdjusted: serializeCurrencyAmount(trade.inputAmountWithGasAdjusted),
    outputAmountWithGasAdjusted: serializeCurrencyAmount(trade.outputAmountWithGasAdjusted),
  }
}

export function parseTrade(chainId: ChainId, trade: SerializedV4Trade): Omit<V4Trade<TradeType>, 'graph'> {
  return {
    ...trade,
    inputAmount: parseCurrencyAmount(chainId, trade.inputAmount),
    outputAmount: parseCurrencyAmount(chainId, trade.outputAmount),
    routes: trade.routes.map((r) => parseRoute(chainId, r)),
    gasEstimate: BigInt(trade.gasEstimate),
    gasCostInBase: parseCurrencyAmount(chainId, trade.gasCostInBase),
    gasCostInQuote: parseCurrencyAmount(chainId, trade.gasCostInQuote),
    inputAmountWithGasAdjusted: parseCurrencyAmount(chainId, trade.inputAmountWithGasAdjusted),
    outputAmountWithGasAdjusted: parseCurrencyAmount(chainId, trade.outputAmountWithGasAdjusted),
  }
}
