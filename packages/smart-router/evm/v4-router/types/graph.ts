import { Currency, CurrencyAmount, Price } from '@pancakeswap/sdk'

export type Vertice = {
  currency?: Currency

  // Price of current currency against base currency
  price?: Price<Currency, Currency>

  // Gas price wei in the form of current token
  gasPrice?: CurrencyAmount<Currency>
}
