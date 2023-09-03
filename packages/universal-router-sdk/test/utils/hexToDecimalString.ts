import { BigNumber, BigNumberish } from 'ethers'

export function hexToDecimalString(hex: BigNumberish) {
  return BigNumber.from(hex).toString()
}
