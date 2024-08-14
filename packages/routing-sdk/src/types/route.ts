import type { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'

import type { Pool, SerializablePool } from './pool'
import type { GasUseEstimate, SerializableGasUseEstimate } from './gasEstimate'
import { SerializableCurrency, SerializableCurrencyAmount } from './currency'

export type BaseRoute<P extends Pool = Pool> = {
  // Pools that swap will go through
  pools: P[]

  path: Currency[]

  percent: number

  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
} & Pick<GasUseEstimate, 'gasUseEstimate'>

export type Route<P extends Pool = Pool> = BaseRoute<P> & GasUseEstimate

export type SerializableBaseRoute = Omit<
  BaseRoute,
  'pools' | 'path' | 'inputAmount' | 'outputAmount' | 'gasUseEstimate'
> & {
  pools: SerializablePool[]
  path: SerializableCurrency[]
  inputAmount: SerializableCurrencyAmount
  outputAmount: SerializableCurrencyAmount
  gasUseEstimate: string
}

export type SerializableRoute = SerializableBaseRoute & SerializableGasUseEstimate
