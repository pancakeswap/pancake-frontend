import type { Currency, CurrencyAmount, Price } from '@pancakeswap/swap-sdk-core'

export type PoolQuoteResult = {
  quote: CurrencyAmount<Currency>
  poolAfter: Pool
}

export type Pool<PType = any, PoolData = any> = {
  getReserve: (c: Currency) => CurrencyAmount<Currency>
  getCurrentPrice: (base: Currency, quote: Currency) => Price<Currency, Currency>

  // Get possible trading pairs of the pool
  getTradingPairs: () => [Currency, Currency][]

  // Get unique id for the pool
  getId: () => string

  getQuote: (params: {
    amount: CurrencyAmount<Currency>
    isExactIn: boolean
    quoteCurrency: Currency
  }) => PoolQuoteResult | undefined

  estimateGasCostForQuote: (quote: PoolQuoteResult) => bigint

  swapToPrice?: (p: Price<Currency, Currency>) => {
    inputAmount: CurrencyAmount<Currency>
  }

  log: () => string

  getPoolData: () => PoolData

  update: (p: Partial<PoolData>) => void

  type: PType
}

export type SerializablePool<PType = any, SerializablePoolData = any> = SerializablePoolData & {
  key: PType
}
