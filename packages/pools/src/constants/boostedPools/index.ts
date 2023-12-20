import { ChainId } from '@pancakeswap/chains'
import { BoosterConfig } from '../../utils/boosted/types'
import { arbBoostedPools } from './arb'
import { opBnbBoostedPools } from './opBNB'

export type BoostedPoolsConfigByChain<TChainId extends ChainId> = {
  [chainId in TChainId]?: BoosterConfig[]
}

export const BOOSTED_POOLS_CONFIG_BY_CHAIN = {
  [ChainId.ARBITRUM_ONE]: arbBoostedPools,
  [ChainId.OPBNB]: opBnbBoostedPools,
} as BoostedPoolsConfigByChain<ChainId>

export const getBoostedPoolsConfig = (chainId: ChainId) => {
  return BOOSTED_POOLS_CONFIG_BY_CHAIN[chainId]
}

export const getBoostedPoolConfig = (chainId: ChainId, contractAddress: string): BoosterConfig | undefined => {
  const pool = getBoostedPoolsConfig(chainId)
  return pool?.find((i) => i?.contractAddress?.toLowerCase() === contractAddress.toLowerCase())
}
