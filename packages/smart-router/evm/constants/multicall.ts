import { ChainId } from '@pancakeswap/sdk'

import { ChainMap, BatchMulticallConfigs } from '../types'

export const BATCH_MULTICALL_CONFIGS: ChainMap<BatchMulticallConfigs> = {
  [ChainId.BSC_TESTNET]: {
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
      multicallChunk: 50,
    },
  },
  [ChainId.BSC]: {
    defaultConfig: {
      multicallChunk: 100,
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
  [ChainId.ETHEREUM]: {
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
  },
  [ChainId.GOERLI]: {
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
  },
}
