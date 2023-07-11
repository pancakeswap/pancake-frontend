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
  [ChainId.ARBITRUM_ONE]: {
    defaultConfig: {
      multicallChunk: 10,
      gasLimitOverride: 12_000_000,
    },
    gasErrorFailureOverride: {
      gasLimitOverride: 30_000_000,
      multicallChunk: 6,
    },
    successRateFailureOverrides: {
      gasLimitOverride: 30_000_000,
      multicallChunk: 6,
    },
  },
  [ChainId.ARBITRUM_GOERLI]: DEFAULT,
  [ChainId.POLYGON_ZKEVM]: {
    defaultConfig: {
      multicallChunk: 3,
      gasLimitOverride: 500_000,
    },
    gasErrorFailureOverride: {
      gasLimitOverride: 1_500_000,
      multicallChunk: 1,
    },
    successRateFailureOverrides: {
      gasLimitOverride: 1_500_000,
      multicallChunk: 1,
    },
  },
  [ChainId.POLYGON_ZKEVM_TESTNET]: {
    defaultConfig: {
      multicallChunk: 3,
      gasLimitOverride: 500_000,
    },
    gasErrorFailureOverride: {
      gasLimitOverride: 1_500_000,
      multicallChunk: 1,
    },
    successRateFailureOverrides: {
      gasLimitOverride: 1_500_000,
      multicallChunk: 1,
    },
  },
  [ChainId.ZKSYNC]: DEFAULT,
  [ChainId.ZKSYNC_TESTNET]: DEFAULT,
  [ChainId.LINEA_TESTNET]: DEFAULT,
}
