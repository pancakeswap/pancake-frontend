import { ChainId } from '@pancakeswap/sdk'

import { ChainMap } from '../types'

// TODO: v3 swap
export const V3_POOL_FACTORY_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.GOERLI]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.BSC]: '',
  [ChainId.BSC_TESTNET]: '0xB46d40a16E949270B44940B0482F1b0951a67046',
}

// = 1 << 23 or 100000000000000000000000
export const V2_FEE_PATH_PLACEHOLDER = 8388608

export const MSG_SENDER = '0x0000000000000000000000000000000000000001'
export const ADDRESS_THIS = '0x0000000000000000000000000000000000000002'
