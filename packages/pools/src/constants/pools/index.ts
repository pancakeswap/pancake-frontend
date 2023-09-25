import { ChainId } from '@pancakeswap/chains'

import { pools as ethPools, livePools as ethLivePools } from './1'
import { pools as bscPools, livePools as bscLivePools } from './56'
import { pools as bscTestnetPools, livePools as bscTestnetLivePools } from './97'
import { pools as arbPools, livePools as arbLivePools } from './42161'
import { pools as arbTestnetPools, livePools as arbTestnetLivePools } from './421613'
import { pools as zkSyncPools, livePools as zkSyncLivePools } from './324'
import { pools as zkSyncTestnetPools, livePools as zkSyncTestnetLivePools } from './280'
import { pools as basePools, livePools as baseLivePools } from './8453'
import { pools as baseTestnetPools, livePools as baseTestnetLivePools } from './84531'
import { pools as lineaPools, livePools as lineaLivePools } from './59144'
import { pools as lineaTestnetPools, livePools as lineaTestnetLivePools } from './59140'
import { pools as polygonZkEvmPools, livePools as polygonZkEvmLivePools } from './1101'
import { pools as polygonZkEvmTestnetPools, livePools as polygonZkEvmTestnetLivePools } from './1442'

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
  [ChainId.BASE]: basePools,
  [ChainId.BASE_TESTNET]: baseTestnetPools,
  [ChainId.LINEA]: lineaPools,
  [ChainId.LINEA_TESTNET]: lineaTestnetPools,
  [ChainId.POLYGON_ZKEVM]: polygonZkEvmPools,
  [ChainId.POLYGON_ZKEVM_TESTNET]: polygonZkEvmTestnetPools,
} as PoolsConfigByChain<SupportedChainId>

export const LIVE_POOLS_CONFIG_BY_CHAIN = {
  [ChainId.ETHEREUM]: ethLivePools,
  [ChainId.BSC]: bscLivePools,
  [ChainId.BSC_TESTNET]: bscTestnetLivePools,
  [ChainId.ARBITRUM_ONE]: arbLivePools,
  [ChainId.ARBITRUM_GOERLI]: arbTestnetLivePools,
  [ChainId.ZKSYNC]: zkSyncLivePools,
  [ChainId.ZKSYNC_TESTNET]: zkSyncTestnetLivePools,
  [ChainId.BASE]: baseLivePools,
  [ChainId.BASE_TESTNET]: baseTestnetLivePools,
  [ChainId.LINEA]: lineaLivePools,
  [ChainId.LINEA_TESTNET]: lineaTestnetLivePools,
  [ChainId.POLYGON_ZKEVM]: polygonZkEvmLivePools,
  [ChainId.POLYGON_ZKEVM_TESTNET]: polygonZkEvmTestnetLivePools,
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
