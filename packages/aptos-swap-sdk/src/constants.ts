import { Percent } from '@pancakeswap/swap-sdk-core'

export enum ChainId {
  DEVNET = 31,
  TESTNET = 2,
}

const SWAP_MODULE_NAME = 'swap' as const
export const SWAP_ADDRESS = '0x456f0476690591a4a64cb7e20a2f9dd15a0e643affc8429902b5db52acb875ea' as const
export const SWAP_TYPE_TAG = `${SWAP_ADDRESS}::${SWAP_MODULE_NAME}` as const

export const PAIR_RESERVE_TYPE_TAG = `${SWAP_TYPE_TAG}::TokenPairReserve` as const
export const PAIR_LP_TYPE_TAG = `${SWAP_TYPE_TAG}::LPToken` as const

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
