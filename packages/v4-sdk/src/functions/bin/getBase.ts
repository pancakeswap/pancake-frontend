import { BASIS_POINT_MAX, SCALE, SCALE_OFFSET } from '../../constants/binPool'

/**
 * Calculates the base from the bin step, which is `1 + binStep / BASIS_POINT_MAX`
 */
export const getBase = (binStep: bigint): bigint => {
  return SCALE + (binStep << SCALE_OFFSET) / BASIS_POINT_MAX
}
