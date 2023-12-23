import { ONRAMP_PROVIDERS } from './constants'

export type ProviderQuote = {
  providerFee: number
  networkFee: number
  quote: number
  amount: number
  fiatCurrency: string
  cryptoCurrency: string
  provider: keyof typeof ONRAMP_PROVIDERS
  price?: number
  error?: string
}

export type ProviderAvailabilities = {
  readonly MoonPay: boolean
  readonly Mercuryo: boolean
  readonly Transak: boolean
}

export enum CryptoFormView {
  Input,
  Quote,
}
