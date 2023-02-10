import { Currency, CurrencyAmount, JSBI } from '@pancakeswap/sdk'

export type L1ToL2GasCosts = {
  gasUsedL1: JSBI
  gasCostL1USD: CurrencyAmount<Currency>
  gasCostL1QuoteToken: CurrencyAmount<Currency>
}
