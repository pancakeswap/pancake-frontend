import { BASIS_POINT_MAX, SCALE, SCALE_OFFSET } from '../../constants/binPool'

/**
 * Calculates the base from the bin step, which is `1 + binStep / BASIS_POINT_MAX`
 */
export const getBase = (binStep: bigint): bigint => {
  // eslint-disable-next-line no-bitwise
  return SCALE + (binStep << SCALE_OFFSET) / BASIS_POINT_MAX
}
