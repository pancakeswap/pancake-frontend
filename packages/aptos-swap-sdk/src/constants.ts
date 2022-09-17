import { Percent } from '@pancakeswap/swap-sdk-core'

export enum ChainId {
  DEVNET = 31,
  TESTNET = 2,
  AIT3 = 47,
}

const SWAP_MODULE_NAME = 'cp_swap'
export const SWAP_ADDRESS = '0x393c959de9606056cf62262bd50d58b58fa58673b4eec016d2fbd9ff6c8948b2'
export const SWAP_TYPE_TAG = `${SWAP_ADDRESS}::${SWAP_MODULE_NAME}`

export const PAIR_RESERVE_TYPE_TAG = `${SWAP_TYPE_TAG}::TokenPairReserve`
export const PAIR_LP_TYPE_TAG = `${SWAP_TYPE_TAG}::LPToken`

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')
