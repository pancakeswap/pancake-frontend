import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import invariant from 'tiny-invariant'
import { ZERO } from '../internalConstants'

const TWO = 2n
const POWERS_OF_2 = [128, 64, 32, 16, 8, 4, 2, 1].map((pow: number): [number, bigint] => [pow, TWO ** BigInt(pow)])

export function mostSignificantBit(x: bigint): number {
  invariant(x > ZERO, 'ZERO')
  invariant(x <= MaxUint256, 'MAX')

  let msb = 0
  for (const [power, min] of POWERS_OF_2) {
    if (x >= min) {
      // eslint-disable-next-line operator-assignment
      x = x >> BigInt(power)
      msb += power
    }
  }
  return msb
}
