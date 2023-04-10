import { JSBI, Percent } from '@pancakeswap/swap-sdk-core'

// constants used internally but not expected to be used externally
export const NEGATIVE_ONE = JSBI.BigInt(-1)
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)

// used in liquidity amount math
export const Q96 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(96))
export const Q192 = JSBI.exponentiate(Q96, JSBI.BigInt(2))

// used in fee calculation
export const MAX_FEE = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(6))
export const ONE_HUNDRED_PERCENT = new Percent('1')
export const ZERO_PERCENT = new Percent('0')
export const Q128 = JSBI.exponentiate(JSBI.BigInt(2), JSBI.BigInt(128))
