import { ChainId } from '@pancakeswap/sdk'
import { Address } from 'viem'

export const FACTORY_ADDRESS = '0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865'

export const DEPLOYER_ADDRESS = '0x41ff9AA7e16B8B1a8a8dc4f0eFacd93D02d071c9'
export const DEPLOYER_ADDRESSES = {
  [ChainId.ETHEREUM]: DEPLOYER_ADDRESS,
  [ChainId.GOERLI]: DEPLOYER_ADDRESS,
  [ChainId.BSC]: DEPLOYER_ADDRESS,
  [ChainId.BSC_TESTNET]: DEPLOYER_ADDRESS,
  // TODO: new chains
  [ChainId.ARBITRUM_ONE]: DEPLOYER_ADDRESS,
  [ChainId.POLYGON_ZKEVM]: DEPLOYER_ADDRESS,
  [ChainId.ZKSYNC]: DEPLOYER_ADDRESS,
  [ChainId.ZKSYNC_TESTNET]: '0xb69D7C41c790Fc5cf3Bf8264F84A8f77f51BeC9F',
} as const satisfies Record<ChainId, Address>

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

const POOL_INIT_CODE_HASH = '0x6ce8eb472fa82df5469c6ab6d485f17c3ad13c8cd7af59b3d4a8026c5ce0f7e2'

export const POOL_INIT_CODE_HASHES = {
  [ChainId.ETHEREUM]: POOL_INIT_CODE_HASH,
  [ChainId.GOERLI]: POOL_INIT_CODE_HASH,
  [ChainId.BSC]: POOL_INIT_CODE_HASH,
  [ChainId.BSC_TESTNET]: POOL_INIT_CODE_HASH,
  [ChainId.ZKSYNC_TESTNET]: '0x0100120308db54623214ef0918f713a740b58e9611fd8d7f345d8407c46c2808',
} as const

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
