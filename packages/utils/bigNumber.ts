import BigNumber from 'bignumber.js'

export const BIG_ZERO = new BigNumber(0)
export const BIG_ONE = new BigNumber(1)
export const BIG_TWO = new BigNumber(2)
export const BIG_NINE = new BigNumber(9)
export const BIG_TEN = new BigNumber(10)
export const BIG_ONE_HUNDRED = new BigNumber(100)

export const bigIntToSerializedBigNumber = (bigint: bigint): string => bigIntToBigNumber(bigint).toJSON()

export const bigIntToBigNumber = (bigint: bigint): BigNumber => new BigNumber(bigint.toString())
