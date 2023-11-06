import { ChainId } from '@pancakeswap/chains'

import { arbBoostedPools } from './42161'

import { BoostedPoolsSupportedChainId } from '../boostedPoolsSupportedChains'
import { isBoostedPoolsSupported } from '../../utils/isBoostedPoolsSupported'

export type BoostedPoolsConfigByChain<TChainId extends ChainId> = {
  [chainId in TChainId]: any[]
}

export const BOOSTED_POOLS_CONFIG_BY_CHAIN = {
  [ChainId.ARBITRUM_ONE]: arbBoostedPools,
} as BoostedPoolsConfigByChain<BoostedPoolsSupportedChainId>

export const getBoostedPoolsConfig = (chainId: ChainId) => {
  if (!isBoostedPoolsSupported(chainId)) {
    return undefined
  }
  return BOOSTED_POOLS_CONFIG_BY_CHAIN[chainId]
}
