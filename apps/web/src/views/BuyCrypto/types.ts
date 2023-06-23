interface Account {
  accountId: string
  baseCurrency: {
    code: string
    createdAt: string
    id: string
    isSellSupported: boolean
    maxAmount: number
    maxBuyAmount: number
    minAmount: number
    minBuyAmount: number
    name: string
    precision: number
    type: string
    updatedAt: string
  }
}

interface Currency {
  baseCurrencyAmount: number
  baseCurrencyCode: string
  currency: {
    addressRegex: string
    addressTagRegex: string | null
    code: string
    confirmationsRequired: number
    createdAt: string
    id: string
    isSellSupported: boolean
    isSupportedInUS: boolean
    isSuspended: boolean
    maxAmount: number
    maxBuyAmount: number | null
    maxSellAmount: number
    metadata: {
      chainId: string | null
      coinType: string
      contractAddress: string | null
      networkCode: string
    }
    minAmount: number
    minBuyAmount: number
    minSellAmount: number
    name: string
    notAllowedCountries: string[]
    notAllowedUSStates: string[]
    precision: number
    supportsAddressTag: boolean
    supportsLiveMode: boolean
    supportsTestMode: boolean
    testnetAddressRegex: string
    type: string
    updatedAt: string
  }
}

interface Quote {
  externalId: string | null
  extraFeeAmount: number
  extraFeeAmountDiscount: null
  extraFeePercentage: number
  feeAmount: number
  feeAmountDiscount: null
  feeDiscountType: null
  networkFeeAmount: number
  networkFeeAmountNonRefundable: boolean
  provider: string
  quoteCurrencyAmount: number
  quoteCurrencyCode: string
  quoteCurrencyPrice: number
  totalAmount: number
}

export interface MercuryResponseData {
  amount: string
  buy_token: string
  currency: string
  fee: {
    ETH: string
    USD: string
  }
  fiat_amount: string
  fiat_currency: string
  kyc_limit_exceeded: boolean
  kyc_limits: boolean
  rate: string
  subtotal: {
    ETH: string
    USD: string
  }
  total: {
    ETH: string
    USD: string
  }
}

export type BscQuote = {
  cryptoAmount: number
  networkFee: number
  quotePrice: number
  userFee: number
}

export type BinanceConnectQuote = {
  code: string
  data: BscQuote
  message: null
  messageDetail: null
  success: true
}

export type MercuryoQuote = {
  data: MercuryResponseData
  status: number
}

export type PriceQuotes = Account & Currency & Quote

export enum CryptoFormView {
  Input,
  Quote,
}
