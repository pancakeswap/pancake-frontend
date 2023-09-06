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
    gasLimitOverride: 2_000_000,
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
  [ChainId.ZKSYNC]: {
    defaultConfig: {
      multicallChunk: 50,
      gasLimitOverride: 1_000_000,
    },
    gasErrorFailureOverride: {
      gasLimitOverride: 1_000_000,
      multicallChunk: 40,
    },
    successRateFailureOverrides: {
      gasLimitOverride: 3_000_000,
      multicallChunk: 45,
    },
  },
  [ChainId.ZKSYNC_TESTNET]: DEFAULT,
  [ChainId.LINEA]: DEFAULT,
  [ChainId.LINEA_TESTNET]: DEFAULT,
  [ChainId.BASE]: DEFAULT,
  [ChainId.BASE_TESTNET]: DEFAULT,
  [ChainId.OPBNB_TESTNET]: DEFAULT,
  [ChainId.SCROLL_SEPOLIA]: DEFAULT,
}
