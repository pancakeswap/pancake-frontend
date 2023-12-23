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

export enum CryptoFormView {
  Input,
  Quote,
}
