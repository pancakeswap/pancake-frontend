import { FixedNumber } from '@ethersproject/bignumber'
import { ChainId } from '@pancakeswap/sdk'

export const FIXED_ZERO = FixedNumber.from(0)
export const FIXED_ONE = FixedNumber.from(1)
export const FIXED_TWO = FixedNumber.from(2)

export const FIXED_100 = FixedNumber.from(100)

export const FARM_AUCTION_HOSTING_IN_SECONDS = 691200

export const masterChefAddresses = {
  [ChainId.BSC_TESTNET]: '0xB4A466911556e39210a6bB2FaECBB59E4eB7E43d',
  [ChainId.BSC]: '0xa5f8C5Dbd5F286960b9d90548680aE5ebFf07652',
}

// TODO: v3 farms addresses
export const masterChefV3Addresses = {
  [ChainId.GOERLI]: '0x085e5E3a68e4E912E0bb3f5A242B808AB97EF5Cd',
  [ChainId.BSC_TESTNET]: '0xdb8E86c68B173F26B06E1B62aec89391303d83E5',
  [ChainId.BSC]: '',
  [ChainId.ETHEREUM]: '',
} as const

export const nonBSCVaultAddresses = {
  [ChainId.ETHEREUM]: '0x2e71B2688019ebdFDdE5A45e6921aaebb15b25fb',
  [ChainId.GOERLI]: '0xE6c904424417D03451fADd6E3f5b6c26BcC43841',
}
