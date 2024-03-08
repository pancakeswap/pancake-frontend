import { CurrencyAmount, Currency, Percent } from '@pancakeswap/swap-sdk-core'

import { getLPOutput, GetLPOutputParams } from './getLPOutput'

export function getLPOutputWithoutFee(params: Omit<GetLPOutputParams, 'fee'>): CurrencyAmount<Currency> {
  return getLPOutput({ ...params, fee: new Percent(0) })
}
