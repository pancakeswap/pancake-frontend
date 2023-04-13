import { ChainId } from '@pancakeswap/sdk'

import { pools as bscPools } from './56'
import { pools as bscTestnetPools } from './97'
import { SerializedPool } from '../../types'
import { SupportedChainId } from '../supportedChains'
import { isPoolsSupported } from '../../utils/isPoolsSupported'

export type PoolsConfigByChain<TChainId extends ChainId> = {
  [chainId in TChainId]: SerializedPool[]
}

export const POOLS_CONFIG_BY_CHAIN = {
  [ChainId.BSC]: bscPools,
  [ChainId.BSC_TESTNET]: bscTestnetPools,
} satisfies PoolsConfigByChain<SupportedChainId>

export const getPoolsConfig = (chainId: ChainId) => {
  if (!isPoolsSupported(chainId)) {
    return undefined
  }
  return POOLS_CONFIG_BY_CHAIN[chainId]
}
