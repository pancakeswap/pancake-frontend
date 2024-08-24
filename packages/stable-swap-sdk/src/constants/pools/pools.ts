import { ChainId } from '@pancakeswap/chains'

import { StableSwapPool } from '../../types'
import { pools as bscPools } from './bsc'
import { pools as arbPools } from './arb'
import { pools as bscTestnetPools } from './bscTestnet'
import { pools as ethPools } from './eth'

export type StableSwapPoolMap<TChainId extends number> = {
  [chainId in TChainId]: StableSwapPool[]
}

export const isStableSwapSupported = (chainId: number | undefined): chainId is StableSupportedChainId => {
  if (!chainId) {
    return false
  }
  return STABLE_SUPPORTED_CHAIN_IDS.includes(chainId)
}

export const STABLE_SUPPORTED_CHAIN_IDS = [
  ChainId.BSC,
  ChainId.BSC_TESTNET,
  ChainId.ARBITRUM_ONE,
  ChainId.ETHEREUM,
] as const

export type StableSupportedChainId = (typeof STABLE_SUPPORTED_CHAIN_IDS)[number]

export const STABLE_POOL_MAP = {
  [ChainId.BSC]: bscPools,
  [ChainId.BSC_TESTNET]: bscTestnetPools,
  [ChainId.ARBITRUM_ONE]: arbPools,
  [ChainId.ETHEREUM]: ethPools,
} satisfies StableSwapPoolMap<StableSupportedChainId>
