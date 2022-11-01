import { Percent } from '@pancakeswap/swap-sdk-core'

import { ADDRESS } from './generated/swap'
import { ADDRESS as _SMARTCHEF_ADDRESS, SMART_CHEF_MODULE_NAME } from './generated/smartchef'

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

export const SMARTCHEF_ADDRESS = _SMARTCHEF_ADDRESS

export const SAMRTCHEF_ADDRESS_MODULE = `${_SMARTCHEF_ADDRESS}::${SMART_CHEF_MODULE_NAME}` as const
export const SMARTCHEF_SYRUP_POOL_TYPE_TAG = `${SAMRTCHEF_ADDRESS_MODULE}::PoolInfo` as const
