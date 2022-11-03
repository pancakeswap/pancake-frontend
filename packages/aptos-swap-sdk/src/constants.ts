import { Percent } from '@pancakeswap/swap-sdk-core'

import { ADDRESS } from './generated/swap'

export enum ChainId {
  TESTNET = 2,
  MAINNET = 1,
}

export const SWAP_ADDRESS = ADDRESS

const SWAP_MODULE_NAME = 'swap' as const

export const SWAP_ADDRESS_MODULE = `${SWAP_ADDRESS}::${SWAP_MODULE_NAME}` as const

export const PAIR_RESERVE_TYPE_TAG = `${SWAP_ADDRESS_MODULE}::TokenPairReserve` as const
export const PAIR_LP_TYPE_TAG = `${SWAP_ADDRESS_MODULE}::LPToken` as const

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
