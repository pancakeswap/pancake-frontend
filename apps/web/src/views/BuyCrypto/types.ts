import { ONRAMP_PROVIDERS } from './constants'

export type ProviderQuote = {
  providerFee: number
  networkFee: number
  amount: number
  quote: number
  fiatCurrency: string
  cryptoCurrency: string
  provider: keyof typeof ONRAMP_PROVIDERS
  price?: number
  noFee?: number
}

export enum CryptoFormView {
  Input,
  Quote,
}
