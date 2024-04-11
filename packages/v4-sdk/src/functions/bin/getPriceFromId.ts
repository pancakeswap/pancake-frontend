import invariant from 'tiny-invariant'
import { maxUint128, maxUint256 } from 'viem'
import { REAL_ID_SHIFT, SCALE } from '../../constants/binPool'
import { getBase } from './getBase'

export const getPriceFromId = (activeId: bigint, binStep: bigint): bigint => {
  const base = getBase(binStep)
  let exponent = activeId - REAL_ID_SHIFT
  let invert = false

  if (exponent === 0n) {
    return SCALE
  }

  if (exponent < 0n) {
    exponent = -exponent
    invert = true
  }

  invariant(exponent < 1n << 20n, 'EXPONENT')

  let squared = base
  let result = SCALE
  if (base > maxUint128) {
    squared = maxUint256 / squared
    invert = invert === false
  }

  for (let i = 0; i < 20; i++) {
    if (exponent & (2n ** BigInt(i))) {
      result = (result * squared) >> 128n
    }
    squared = (squared * squared) >> 128n
  }

  return invert ? maxUint256 / result : result
}
