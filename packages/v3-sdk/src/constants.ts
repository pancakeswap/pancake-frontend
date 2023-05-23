import { ChainId } from '@pancakeswap/sdk'
import { Address } from 'viem'

export const FACTORY_ADDRESS = '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865'

export const DEPLOYER_ADDRESS = '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9'
export const DEPLOYER_ADDRESSES = {
  [ChainId.ETHEREUM]: DEPLOYER_ADDRESS,
  [ChainId.GOERLI]: DEPLOYER_ADDRESS,
  [ChainId.BSC]: DEPLOYER_ADDRESS,
  [ChainId.BSC_TESTNET]: DEPLOYER_ADDRESS,
} as const satisfies Record<ChainId, Address>

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const POOL_INIT_CODE_HASH = '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2'

/**
 * The default factory enabled fee amounts, denominated in hundredths of bips.
 */
export enum FeeAmount {
  LOWEST = 100,
  LOW = 500,
  MEDIUM = 2500,
  HIGH = 10000,
}

/**
 * The default factory tick spacings by fee amount.
 */
export const TICK_SPACINGS: { [amount in FeeAmount]: number } = {
  [FeeAmount.LOWEST]: 1,
  [FeeAmount.LOW]: 10,
  [FeeAmount.MEDIUM]: 50,
  [FeeAmount.HIGH]: 200,
}
