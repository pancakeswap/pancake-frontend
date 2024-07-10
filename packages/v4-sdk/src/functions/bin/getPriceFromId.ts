import invariant from 'tiny-invariant'
import { maxUint128, maxUint256 } from 'viem'
import { BASIS_POINT_MAX, REAL_ID_SHIFT, SCALE, SCALE_OFFSET } from '../../constants/binPool'

/**
 * Calculates the base from the bin step, which is `1 + binStep / BASIS_POINT_MAX`
 */
const getBase = (binStep: bigint): bigint => {
  // eslint-disable-next-line no-bitwise
  return SCALE + (binStep << SCALE_OFFSET) / BASIS_POINT_MAX
}

const Q128 = 2n ** 128n
const Q20 = 2n ** 20n

/**
 * Calculates the price from the given activeId and binStep
 *
 * @param activeId
 * @param binStep
 * @returns
 */
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

  invariant(exponent < Q20, 'EXPONENT')

  let squared = base
  let result = SCALE
  if (base > maxUint128) {
    squared = maxUint256 / squared
    invert = invert === false
  }

  for (let i = 0; i < 20; i++) {
    // eslint-disable-next-line no-bitwise
    if (exponent & (2n ** BigInt(i))) {
      result = (result * squared) / Q128
    }
    squared = (squared * squared) / Q128
  }

  return invert ? maxUint256 / result : result
}
