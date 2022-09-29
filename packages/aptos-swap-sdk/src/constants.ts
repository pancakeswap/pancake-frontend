import { Percent } from '@pancakeswap/swap-sdk-core'

export enum ChainId {
  DEVNET = 32,
  TESTNET = 2,
}

const SWAP_MODULE_NAME = 'swap' as const
export const SWAP_ADDRESS = '0xcdfdd85820f4a66ba6589620105746d5a2202906cf78e718af159c07a0520151' as const
export const SWAP_RESOURCE_ADDRESS = '0x540bc17b2ddcf44abcff62b9a1939e23cdec44a6078e98ca79fcc98253ac354d' as const
export const SWAP_TYPE_TAG = `${SWAP_ADDRESS}::${SWAP_MODULE_NAME}` as const

export const PAIR_RESERVE_TYPE_TAG = `${SWAP_ADDRESS}::swap::TokenPairReserve` as const
export const PAIR_LP_TYPE_TAG = `${SWAP_RESOURCE_ADDRESS}::storage::LPToken` as const

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
