import { Percent } from '@pancakeswap/swap-sdk-core'

// constants used internally but not expected to be used externally
export const NEGATIVE_ONE = BigInt(-1)
export const ZERO = 0n
export const ONE = 1n

// used in liquidity amount math
export const Q96 = 2n ** 96n
export const Q192 = Q96 ** 2n

// used in fee calculation
export const MAX_FEE = 10n ** 6n
export const ONE_HUNDRED_PERCENT = new Percent('1')
export const ZERO_PERCENT = new Percent('0')
export const Q128 = 2n ** 128n
