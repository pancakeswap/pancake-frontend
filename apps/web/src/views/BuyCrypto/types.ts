export type ProviderQuote = {
  providerFee: number
  networkFee: number
  amount: number
  quote: number
  fiatCurrency: string
  cryptoCurrency: string
  provider: string
  price?: number
  noFee?: number
}

export enum CryptoFormView {
  Input,
  Quote,
}
