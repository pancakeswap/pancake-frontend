import { ChainId } from '@pancakeswap/sdk'

import { ChainMap } from '../types'

export const V3_POOL_FACTORY_ADDRESS: ChainMap<string> = {
  [ChainId.ETHEREUM]: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.GOERLI]: '',
  [ChainId.BSC]: '',
  [ChainId.BSC_TESTNET]: '',
}

// = 1 << 23 or 100000000000000000000000
export const V2_FEE_PATH_PLACEHOLDER = 8388608
