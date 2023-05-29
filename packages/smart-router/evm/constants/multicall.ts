import { ChainId } from '@pancakeswap/sdk'

import { ChainMap, BatchMulticallConfigs } from '../types'

const DEFAULT = {
  defaultConfig: {
    multicallChunk: 150,
    gasLimitOverride: 1_000_000,
  },
  gasErrorFailureOverride: {
    gasLimitOverride: 1_000_000,
    multicallChunk: 30,
  },
  successRateFailureOverrides: {
    gasLimitOverride: 1_000_000,
    multicallChunk: 40,
  },
}

export const BATCH_MULTICALL_CONFIGS: ChainMap<BatchMulticallConfigs> = {
  [ChainId.BSC_TESTNET]: DEFAULT,
  [ChainId.BSC]: {
    defaultConfig: {
      multicallChunk: 50,
      gasLimitOverride: 1_000_000,
    },
    gasErrorFailureOverride: {
      gasLimitOverride: 1_000_000,
      multicallChunk: 40,
    },
    successRateFailureOverrides: {
      gasLimitOverride: 1_000_000,
      multicallChunk: 45,
    },
  },
  [ChainId.ETHEREUM]: DEFAULT,
  [ChainId.GOERLI]: DEFAULT,
  [ChainId.ARBITRUM_ONE]: DEFAULT,
  [ChainId.ARBITRUM_GOERLI]: DEFAULT,
  [ChainId.POLYGON_ZKEVM]: DEFAULT,
  [ChainId.POLYGON_ZKEVM_TESTNET]: DEFAULT,
  [ChainId.ZKSYNC]: DEFAULT,
  [ChainId.ZKSYNC_TESTNET]: DEFAULT,
  [ChainId.LINEA_TESTNET]: DEFAULT,
}
