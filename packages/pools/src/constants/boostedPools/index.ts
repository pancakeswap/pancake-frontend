import { ChainId } from '@pancakeswap/chains'

import { arbBoostedPools } from './arb'

import { BoostedPoolsSupportedChainId } from '../boostedPoolsSupportedChains'
import { isBoostedPoolsSupported } from '../../utils/boosted/isBoostedPoolsSupported'
import { BoosterConfig } from '../../utils/boosted/types'

export type BoostedPoolsConfigByChain<TChainId extends ChainId> = {
  [chainId in TChainId]: BoosterConfig[]
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
