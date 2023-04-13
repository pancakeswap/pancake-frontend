import { ChainId } from '@pancakeswap/sdk'

import { pools as bscPools } from './56'
import { SerializedPool } from '../../types'

export type PoolsConfigByChain<TChainId extends ChainId> = {
  [chainId in TChainId]: SerializedPool[]
}

export const POOLS_SUPPORTED_CHAIN_IDS = [ChainId.BSC] as const

export type PoolsSupportedChainId = (typeof POOLS_SUPPORTED_CHAIN_IDS)[number]

export const POOLS_CONFIG_BY_CHAIN = {
  [ChainId.BSC]: bscPools,
} satisfies PoolsConfigByChain<PoolsSupportedChainId>

export const isPoolsSupported = (chainId: number): chainId is PoolsSupportedChainId =>
  POOLS_SUPPORTED_CHAIN_IDS.includes(chainId)

export const getPoolsConfig = (chainId: ChainId) => {
  if (!isPoolsSupported(chainId)) {
    return undefined
  }
  return POOLS_CONFIG_BY_CHAIN[chainId]
}
