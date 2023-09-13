import { BigNumber } from 'bignumber.js'

export function hexToDecimalString(hex: any) {
  return new BigNumber(hex).toString()
}
