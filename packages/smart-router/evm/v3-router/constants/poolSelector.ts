import { ChainId } from '@pancakeswap/sdk'
import { bscTokens } from '@pancakeswap/tokens'

import { PoolSelectorConfig } from '../types'

export const DEFAULT_POOL_SELECTOR_CONFIG: PoolSelectorConfig = {
  topN: 2,
  topNDirectSwaps: 2,
  topNTokenInOut: 2,
  topNSecondHop: 1,
  topNWithEachBaseToken: 3,
  topNWithBaseToken: 3,
}

export const V3_DEFAULT_POOL_SELECTOR_CONFIG: { [chain: number]: PoolSelectorConfig } = {
  [ChainId.BSC]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4,
  },
  [ChainId.BSC_TESTNET]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4,
  },
  [ChainId.ETHEREUM]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4,
  },
  [ChainId.GOERLI]: {
    topN: 2,
    topNDirectSwaps: 2,
    topNTokenInOut: 2,
    topNSecondHop: 1,
    topNWithEachBaseToken: 3,
    topNWithBaseToken: 4,
  },
}

// Use to configure pool selector config when getting quote from specific tokens
// Allow to increase or decrese the number of candidate pools to calculate routes from
export const V3_TOKEN_POOL_SELECTOR_CONFIG: { [chain: number]: { [key: string]: Partial<PoolSelectorConfig> } } = {
  [ChainId.BSC]: {
    [bscTokens.ankr.address]: {
      topNTokenInOut: 4,
    },
    [bscTokens.ankrbnb.address]: {
      topNTokenInOut: 4,
    },
    [bscTokens.ankrETH.address]: {
      topNTokenInOut: 4,
    },
  },
}
