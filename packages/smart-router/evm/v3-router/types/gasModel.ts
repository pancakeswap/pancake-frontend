import { Currency, CurrencyAmount } from '@pancakeswap/sdk'

import { GasCost } from './gasCost'
import { RouteWithoutGasEstimate } from './route'

export type L1ToL2GasCosts = {
  gasUsedL1: bigint
  gasCostL1USD: CurrencyAmount<Currency>
  gasCostL1QuoteToken: CurrencyAmount<Currency>
}

export interface GasEstimateRequiredInfo {
  initializedTickCrossedList: number[]
}

export interface GasModel {
  estimateGasCost: (route: RouteWithoutGasEstimate, info: GasEstimateRequiredInfo) => GasCost
}
