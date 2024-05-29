import type { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'

import type { Pool } from './pool'
import type { GasUseEstimate } from './gasEstimate'

export type BaseRoute = {
  // Pools that swap will go through
  pools: Pool[]

  path: Currency[]

  percent: number

  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
} & Pick<GasUseEstimate, 'gasUseEstimate'>

export type Route = BaseRoute & GasUseEstimate
