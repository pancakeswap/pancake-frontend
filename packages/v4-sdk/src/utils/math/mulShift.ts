/* eslint-disable no-bitwise */
import invariant from 'tiny-invariant'
import { maxUint256 } from 'viem'

export const mulShiftRoundUp = (x: bigint, y: bigint, offset: bigint): bigint => {
  let result = mulShiftRoundDown(x, y, offset)
  if ((x * y) % (1n << offset) !== 0n) {
    result++
  }
  return result
}

export const mulShiftRoundDown = (x: bigint, y: bigint, offset: bigint): bigint => {
  const [prod0, prod1] = _getMulProds(x, y)
  let result = 0n

  if (prod0 !== 0n) {
    result = prod0 >> offset
  }

  if (prod1 !== 0n) {
    invariant(offset < 1n << offset, 'MUL_SHIFT_OVERFLOW')

    result += prod1 << (256n - offset)
  }

  return result
}

const _getMulProds = (x: bigint, y: bigint): [bigint, bigint] => {
  const mm = (x * y) % maxUint256
  const prod0 = x * y
  const prod1 = mm - prod0 - (mm < prod0 ? 1n : 0n)
  return [prod0, prod1]
}
