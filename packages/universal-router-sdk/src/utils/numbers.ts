import { BigNumber } from 'bignumber.js'
import { Percent } from '@uniswap/sdk-core'
import { toHex } from '@uniswap/v3-sdk'

export function expandTo18DecimalsBN(n: number): BigNumber {
  // use bn intermediately to allow decimals in intermediate calculations
  return new BigNumber(new BigNumber(n).times(new BigNumber(10).pow(18)).toFixed())
}

export function expandTo18Decimals(n: number): string {
  return new BigNumber(n).multipliedBy(new BigNumber(10).pow(18)).toString()
}

export function encodeFeeBips(fee: Percent): string {
  return toHex(fee.multiply(10_000).quotient)
}
