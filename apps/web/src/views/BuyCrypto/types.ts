import type { ChainId } from '@pancakeswap/chains'
import type { ONRAMP_PROVIDERS, OnRampChainId } from './constants'
import { ProviderAvailabilities } from './hooks/useProviderAvailabilities'

export type ProviderQuote = {
  providerFee: number
  networkFee: number
  pancakeFee: number
  quote: number
  amount: number
  fiatCurrency: string
  cryptoCurrency: string
  provider: keyof typeof ONRAMP_PROVIDERS
  price?: number
  error?: string
}

export enum CryptoFormView {
  Input = 'Input',
  Quote = 'Quote',
}

export enum OnRampUnit {
  Fiat = 'Fiat',
  Crypto = 'Crypto',
}

export type FiatCurrency = {
  symbol: string
  name: string
}

export type OnRampProviderQuote = {
  providerFee: number
  networkFee: number
  pancakeFee: number
  amount: number
  quote: number
  fiatCurrency: string
  cryptoCurrency: string
  provider: keyof typeof ONRAMP_PROVIDERS
  price: number
  noFee?: number
  error?: unknown
}

export type OnRampQuotesPayload = {
  fiatCurrency: string | undefined
  cryptoCurrency: string | undefined
  fiatAmount: string | undefined
  network: OnRampChainId | undefined
  onRampUnit: OnRampUnit
  providerAvailabilities: ProviderAvailabilities
}

export type OnRampLimitsPayload = {
  fiatCurrency: string | undefined
  cryptoCurrency: string | undefined
  network: OnRampChainId | ChainId | undefined
}

export type OnRampSignaturesPayload = {
  provider: keyof typeof ONRAMP_PROVIDERS
  fiatCurrency: string | undefined
  cryptoCurrency: string | undefined
  network: string | undefined
  amount: number
  redirectUrl: string
  externalTransactionId: string | undefined
  walletAddress: string | undefined
}

export type CurrencyLimits = {
  code: string
  maxBuyAmount: number
  minBuyAmount: number
}

export interface LimitQuote {
  baseCurrency: CurrencyLimits
  quoteCurrency: CurrencyLimits
}
