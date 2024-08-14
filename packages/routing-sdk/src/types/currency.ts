import { Address } from './base'

export type SerializableCurrency = {
  address: Address
  decimals: number
  symbol: string
}

export type SerializableCurrencyAmount = {
  currency: SerializableCurrency
  value: string
}
