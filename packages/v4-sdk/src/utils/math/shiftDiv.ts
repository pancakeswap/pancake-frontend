/* eslint-disable no-param-reassign */
/* eslint-disable no-bitwise */
import invariant from 'tiny-invariant'

export const shiftDivRoundDown = (x: bigint, offset: bigint | number, denominator: bigint): bigint => {
  const prod0 = x << BigInt(offset)
  const prod1 = x >> (256n - BigInt(offset))

  return _getEndOfDivRoundDown(x, 1n << BigInt(offset), denominator, prod0, prod1)
}

export const shiftDivRoundUp = (x: bigint, offset: bigint | number, denominator: bigint): bigint => {
  let result = shiftDivRoundDown(x, offset, denominator)
  if ((x * (1n << BigInt(offset))) % denominator !== 0n) {
    result++
  }
  return result
}

const _getEndOfDivRoundDown = (x: bigint, y: bigint, denominator: bigint, prod0: bigint, prod1: bigint): bigint => {
  if (prod1 === 0n) {
    return prod0 / denominator
  }

  invariant(prod1 < denominator, 'MUL_DIV_OVERFLOW')

  const remainder = (x * y) % denominator
  prod1 = prod1 - remainder > prod0 ? 1n : 0n
  prod0 -= remainder

  let lpotdod = denominator & (~denominator + 1n)
  denominator /= lpotdod
  prod0 /= lpotdod
  lpotdod = -lpotdod / lpotdod + 1n

  prod0 |= prod1 * lpotdod

  let inverse = (3n * denominator) ^ 2n

  let n = 0
  while (n < 5) {
    inverse *= 2n - denominator * inverse
    n++
  }

  return prod0 * inverse
}
