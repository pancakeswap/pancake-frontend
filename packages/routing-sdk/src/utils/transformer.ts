import { ChainId } from '@pancakeswap/chains'
import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import { Native, ERC20Token } from '@pancakeswap/swap-sdk-evm'

import { Address } from '../types'
import { ADDRESS_ZERO } from '../constants'

export type SerializedTick = {
  index: number
  liquidityGross: string
  liquidityNet: string
}

export type SerializableCurrency = {
  address: Address
  decimals: number
  symbol: string
}

export type SerializableCurrencyAmount = {
  currency: SerializableCurrency
  value: string
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
