import type { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'

export type GasUseEstimate = {
  gasUseEstimate: bigint
  gasUseEstimateBase: CurrencyAmount<Currency>
  gasUseEstimateQuote: CurrencyAmount<Currency>
  inputAmountWithGasAdjusted: CurrencyAmount<Currency>
  outputAmountWithGasAdjusted: CurrencyAmount<Currency>
}
