import { Currency, CurrencyAmount, JSBI } from '@pancakeswap/sdk'

import { GasCost } from './gasCost'
import { RouteWithoutGasEstimate } from './route'

export type L1ToL2GasCosts = {
  gasUsedL1: JSBI
  gasCostL1USD: CurrencyAmount<Currency>
  gasCostL1QuoteToken: CurrencyAmount<Currency>
}

export interface GasEstimateRequiredInfo {
  initializedTickCrossedList: number[]
}

export interface GasModel {
  estimateGasCost: (route: RouteWithoutGasEstimate, info: GasEstimateRequiredInfo) => GasCost
}
