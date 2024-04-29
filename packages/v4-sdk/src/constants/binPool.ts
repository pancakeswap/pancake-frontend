/**
 * Constants of the BinPool
 */

export const SCALE_OFFSET = 128n

// eslint-disable-next-line no-bitwise
export const SCALE = 1n << SCALE_OFFSET

export const PRECISION = BigInt(1e18)

export const SQUARED_PRECISION = BigInt(1e36)

export const BASIS_POINT_MAX = 10000n

// eslint-disable-next-line no-bitwise
export const REAL_ID_SHIFT = 1n << 23n
