import { ChainId } from '@pancakeswap/chains'

import { livePools as ethLivePools, pools as ethPools } from './1'
import { livePools as polygonZkEvmLivePools, pools as polygonZkEvmPools } from './1101'
import { livePools as polygonZkEvmTestnetLivePools, pools as polygonZkEvmTestnetPools } from './1442'
import { livePools as opBNBLivePools, pools as opBNBPools } from './204'
import { livePools as zkSyncTestnetLivePools, pools as zkSyncTestnetPools } from './280'
import { livePools as zkSyncLivePools, pools as zkSyncPools } from './324'
import { livePools as arbLivePools, pools as arbPools } from './42161'
import { livePools as arbTestnetLivePools, pools as arbTestnetPools } from './421613'
import { livePools as bscLivePools, pools as bscPools } from './56'
import { livePools as lineaTestnetLivePools, pools as lineaTestnetPools } from './59140'
import { livePools as lineaLivePools, pools as lineaPools } from './59144'
import { livePools as baseLivePools, pools as basePools } from './8453'
import { livePools as baseTestnetLivePools, pools as baseTestnetPools } from './84531'
import { livePools as bscTestnetLivePools, pools as bscTestnetPools } from './97'

import { SerializedPool } from '../../types'
import { isPoolsSupported } from '../../utils/isPoolsSupported'
import { SupportedChainId } from '../supportedChains'

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
  [ChainId.OPBNB]: opBNBPools,
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
  [ChainId.OPBNB]: opBNBLivePools,
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
