import { Percent } from '@pancakeswap/swap-sdk-core'

export enum ChainId {
  DEVNET = 31,
  TESTNET = 2,
}

const SWAP_MODULE_NAME = 'swap' as const
export const SWAP_ADDRESS = '0xc23db0e6419eec6786f0faa9642907e12e88b18ad1e8b9910f53935caff59d2d' as const
export const SWAP_RESOURCE_ADDRESS = '0x4989a662eed18e34e697985cffeae08aadce14b7483ebe0b3ad37622057d8231' as const
export const SWAP_TYPE_TAG = `${SWAP_ADDRESS}::${SWAP_MODULE_NAME}` as const

export const PAIR_RESERVE_TYPE_TAG = `${SWAP_ADDRESS}::swap::TokenPairReserve` as const
export const PAIR_LP_TYPE_TAG = `${SWAP_RESOURCE_ADDRESS}::storage::LPToken` as const

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
