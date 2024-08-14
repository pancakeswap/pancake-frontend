import { ChainId } from '@pancakeswap/chains'
import { Currency, CurrencyAmount, TradeType } from '@pancakeswap/swap-sdk-core'
import { Native, ERC20Token } from '@pancakeswap/swap-sdk-evm'

import {
  SerializableCurrency,
  SerializableCurrencyAmount,
  Pool,
  Route,
  SerializablePool,
  SerializableRoute,
  Trade,
  SerializableTrade,
} from '../types'
import { ADDRESS_ZERO } from '../constants'

export type SerializableConfig<P extends Pool = Pool, SP extends SerializablePool = SerializablePool> = {
  toSerializablePool: (pool: P) => SP
}

export type ParseConfig<P extends Pool = Pool, SP extends SerializablePool = SerializablePool> = {
  parsePool: (chainId: ChainId, pool: SP) => P
}

export function toSerializableCurrency(currency: Currency): SerializableCurrency {
  return {
    address: currency.isNative ? ADDRESS_ZERO : currency.wrapped.address,
    decimals: currency.decimals,
    symbol: currency.symbol,
  }
}

export function toSerializableCurrencyAmount(amount: CurrencyAmount<Currency>): SerializableCurrencyAmount {
  return {
    currency: toSerializableCurrency(amount.currency),
    value: amount.quotient.toString(),
  }
}

export function toSerializableRoute<P extends Pool = Pool, SP extends SerializablePool = SerializablePool>(
  route: Route<P>,
  { toSerializablePool }: SerializableConfig<P, SP>,
): SerializableRoute {
  return {
    ...route,
    pools: route.pools.map(toSerializablePool),
    path: route.path.map(toSerializableCurrency),
    inputAmount: toSerializableCurrencyAmount(route.inputAmount),
    outputAmount: toSerializableCurrencyAmount(route.outputAmount),
    gasUseEstimate: String(route.gasUseEstimate),
    gasUseEstimateBase: toSerializableCurrencyAmount(route.gasUseEstimateBase),
    gasUseEstimateQuote: toSerializableCurrencyAmount(route.gasUseEstimateQuote),
    inputAmountWithGasAdjusted: toSerializableCurrencyAmount(route.inputAmountWithGasAdjusted),
    outputAmountWithGasAdjusted: toSerializableCurrencyAmount(route.outputAmountWithGasAdjusted),
  }
}

export function toSerializableTrade<P extends Pool = Pool, SP extends SerializablePool = SerializablePool>(
  trade: Trade<TradeType, P>,
  config: SerializableConfig<P, SP>,
): SerializableTrade {
  return {
    ...trade,
    inputAmount: toSerializableCurrencyAmount(trade.inputAmount),
    outputAmount: toSerializableCurrencyAmount(trade.outputAmount),
    routes: trade.routes.map((route) => toSerializableRoute(route, config)),
    gasUseEstimate: String(trade.gasUseEstimate),
    gasUseEstimateBase: toSerializableCurrencyAmount(trade.gasUseEstimateBase),
    gasUseEstimateQuote: toSerializableCurrencyAmount(trade.gasUseEstimateQuote),
    inputAmountWithGasAdjusted: toSerializableCurrencyAmount(trade.inputAmountWithGasAdjusted),
    outputAmountWithGasAdjusted: toSerializableCurrencyAmount(trade.outputAmountWithGasAdjusted),
  }
}

export function parseCurrency(chainId: ChainId, currency: SerializableCurrency): Currency {
  if (currency.address === ADDRESS_ZERO) {
    return Native.onChain(chainId)
  }
  const { address, decimals, symbol } = currency
  return new ERC20Token(chainId, address, decimals, symbol)
}

export function parseCurrencyAmount(chainId: ChainId, amount: SerializableCurrencyAmount): CurrencyAmount<Currency> {
  return CurrencyAmount.fromRawAmount(parseCurrency(chainId, amount.currency), amount.value)
}

export function parseRoute<P extends Pool = Pool, SP extends SerializablePool = SerializablePool>(
  chainId: ChainId,
  route: SerializableRoute,
  { parsePool }: ParseConfig<P, SP>,
): Route {
  return {
    ...route,
    pools: route.pools.map((p) => parsePool(chainId, p)),
    path: route.path.map((n) => parseCurrency(chainId, n)),
    inputAmount: parseCurrencyAmount(chainId, route.inputAmount),
    outputAmount: parseCurrencyAmount(chainId, route.outputAmount),
    gasUseEstimate: BigInt(route.gasUseEstimate),
    gasUseEstimateBase: parseCurrencyAmount(chainId, route.gasUseEstimateBase),
    gasUseEstimateQuote: parseCurrencyAmount(chainId, route.gasUseEstimateQuote),
    inputAmountWithGasAdjusted: parseCurrencyAmount(chainId, route.inputAmountWithGasAdjusted),
    outputAmountWithGasAdjusted: parseCurrencyAmount(chainId, route.outputAmountWithGasAdjusted),
  }
}

export function parseTrade<P extends Pool = Pool, SP extends SerializablePool = SerializablePool>(
  chainId: ChainId,
  trade: SerializableTrade,
  config: ParseConfig<P, SP>,
): Trade<TradeType> {
  return {
    ...trade,
    routes: trade.routes.map((r) => parseRoute<P, SP>(chainId, r, config)),
    inputAmount: parseCurrencyAmount(chainId, trade.inputAmount),
    outputAmount: parseCurrencyAmount(chainId, trade.outputAmount),
    gasUseEstimate: BigInt(trade.gasUseEstimate),
    gasUseEstimateBase: parseCurrencyAmount(chainId, trade.gasUseEstimateBase),
    gasUseEstimateQuote: parseCurrencyAmount(chainId, trade.gasUseEstimateQuote),
    inputAmountWithGasAdjusted: parseCurrencyAmount(chainId, trade.inputAmountWithGasAdjusted),
    outputAmountWithGasAdjusted: parseCurrencyAmount(chainId, trade.outputAmountWithGasAdjusted),
  }
}
