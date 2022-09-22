import { Percent } from '@pancakeswap/swap-sdk-core'

export enum ChainId {
  DEVNET = 31,
  TESTNET = 2,
}

const SWAP_MODULE_NAME = 'swap'
export const SWAP_ADDRESS = '0xca498e78eca95ade4015b82f43c4cfe3aa66ea9b702b79234057add94c9cf2d'
export const SWAP_TYPE_TAG = `${SWAP_ADDRESS}::${SWAP_MODULE_NAME}`

export const PAIR_RESERVE_TYPE_TAG = `${SWAP_TYPE_TAG}::TokenPairReserve`
export const PAIR_LP_TYPE_TAG = `${SWAP_TYPE_TAG}::LPToken`

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
