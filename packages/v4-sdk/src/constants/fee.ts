/**
 * max swap fee for a pool
 */

/**
 * for clamm, the max fee is 100%
 */
export const ONE_HUNDRED_PERCENT_FEE = 1_000_000n

/**
 * for bin pool, the max fee is 10%
 */
export const TEN_PERCENT_FEE = 100_000n

/**
 * Max protocol fee is 0.1% (1000 pips)
 */
export const MAX_PROTOCOL_FEE = 1_000n

/**
 * a dynamic fee pool must have exactly same value for fee field
 *
 */
export const DYNAMIC_FEE_FLAG = 0x800000
