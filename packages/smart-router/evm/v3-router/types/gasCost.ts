import { Currency, CurrencyAmount, JSBI } from '@pancakeswap/sdk'

export interface GasCost {
  gasEstimate: JSBI
  // The gas cost in terms of the quote token.
  gasCostInToken: CurrencyAmount<Currency>
  gasCostInUSD: CurrencyAmount<Currency>
}
