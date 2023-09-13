import { Percent as PancakePercent } from '@pancakeswap/sdk'
import { BigNumber } from 'bignumber.js'

export function expandTo18DecimalsBN(n: number): BigNumber {
  // use bn intermediately to allow decimals in intermediate calculations
  return new BigNumber(new BigNumber(n).times(new BigNumber(10).pow(18)).toFixed())
}
export function expandTo18Decimals(n: number): bigint {
  return BigInt(BigInt(n) * (10n ** 18n));
}

export function encodeFeeBips(fee: PancakePercent): string {
  return fee.multiply(10_000).quotient.toString()
}
