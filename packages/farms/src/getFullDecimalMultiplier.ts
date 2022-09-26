import { BigNumber } from '@ethersproject/bignumber'
import memoize from 'lodash/memoize'

const BIG_TEN = BigNumber.from(10)

export const getFullDecimalMultiplier = memoize((decimals: number): BigNumber => {
  return BIG_TEN.pow(decimals)
})
