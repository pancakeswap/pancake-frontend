import { ChainId } from '@pancakeswap/sdk'

import { pools as ethPools, livePools as ethLivePools } from './1'
import { pools as bscPools, livePools as bscLivePools } from './56'
import { pools as bscTestnetPools, livePools as bscTestnetLivePools } from './97'
import { pools as arbPools, livePools as arbLivePools } from './42161'
import { pools as arbTestnetPools, livePools as arbTestnetLivePools } from './421613'
import { pools as zkSyncPools, livePools as zkSyncLivePools } from './324'
import { pools as zkSyncTestnetPools, livePools as zkSyncTestnetLivePools } from './280'
import { SerializedPool } from '../../types'
import { SupportedChainId } from '../supportedChains'
import { isPoolsSupported } from '../../utils/isPoolsSupported'

export type PoolsConfigByChain<TChainId extends ChainId> = {
  [chainId in TChainId]: SerializedPool[]
}

export const POOLS_CONFIG_BY_CHAIN = {
  [ChainId.ETHEREUM]: ethPools,
  [ChainId.BSC]: bscPools,
  [ChainId.BSC_TESTNET]: bscTestnetPools,
  [ChainId.ARBITRUM_ONE]: arbPools,
  [ChainId.ARBITRUM_GOERLI]: arbTestnetPools,
  [ChainId.ZKSYNC]: zkSyncPools,
  [ChainId.ZKSYNC_TESTNET]: zkSyncTestnetPools,
} as PoolsConfigByChain<SupportedChainId>

export const LIVE_POOLS_CONFIG_BY_CHAIN = {
  [ChainId.ETHEREUM]: ethLivePools,
  [ChainId.BSC]: bscLivePools,
  [ChainId.BSC_TESTNET]: bscTestnetLivePools,
  [ChainId.ARBITRUM_ONE]: arbLivePools,
  [ChainId.ARBITRUM_GOERLI]: arbTestnetLivePools,
  [ChainId.ZKSYNC]: zkSyncLivePools,
  [ChainId.ZKSYNC_TESTNET]: zkSyncTestnetLivePools,
} as PoolsConfigByChain<SupportedChainId>

export const getPoolsConfig = (chainId: ChainId) => {
  if (!isPoolsSupported(chainId)) {
    return undefined
  }
  return POOLS_CONFIG_BY_CHAIN[chainId]
}

export const getLivePoolsConfig = (chainId: ChainId) => {
  if (!isPoolsSupported(chainId)) {
    return undefined
  }
  return LIVE_POOLS_CONFIG_BY_CHAIN[chainId]
}

export const MAX_LOCK_DURATION = 31536000
export const UNLOCK_FREE_DURATION = 604800
export const ONE_WEEK_DEFAULT = 604800
export const BOOST_WEIGHT = 20000000000000n
export const DURATION_FACTOR = 31536000n
