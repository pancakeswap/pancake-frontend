import { FixedNumber } from '@ethersproject/bignumber'
import { getFullDecimalMultiplier } from './getFullDecimalMultiplier'

export const FIXED_ZERO = FixedNumber.from(0)
export const FIXED_ONE = FixedNumber.from(1)
export const FIXED_TWO = FixedNumber.from(2)

export const FIXED_TEN_IN_POWER_18 = FixedNumber.from(getFullDecimalMultiplier(18))

export const masterChefAddresses = {
  97: '0xB4A466911556e39210a6bB2FaECBB59E4eB7E43d',
  56: '0x753aAfBEe43D88aED31A82aDABCa12d3F5455fd3', // TODO: NonBSCFarm 0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652
}

export const nonBSCVaultAddresses = {
  1: '0x9ABAd58916aAbF71E5dEAC73F85E845f74666fBE',
  5: '0xE6c904424417D03451fADd6E3f5b6c26BcC43841',
}
