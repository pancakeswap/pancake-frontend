import { Percent } from '@pancakeswap/swap-sdk-core'

export enum ChainId {
  DEVNET = 31,
  TESTNET = 2,
}

const SWAP_MODULE_NAME = 'swap' as const
export const SWAP_ADDRESS = '0xaa16ed61ecbc91e151cffd7c34bbf9a551235d977eca8f7aed5d9d45e8790b1f' as const
export const SWAP_RESOURCE_ADDRESS = '0xc4470c2aae1e5c9cd03e29651f1425ae49768122545825281157834d99f73f02' as const
export const SWAP_TYPE_TAG = `${SWAP_ADDRESS}::${SWAP_MODULE_NAME}` as const

export const PAIR_RESERVE_TYPE_TAG = `${SWAP_ADDRESS}::swap::TokenPairReserve` as const
export const PAIR_LP_TYPE_TAG = `${SWAP_RESOURCE_ADDRESS}::storage::LPToken` as const

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
