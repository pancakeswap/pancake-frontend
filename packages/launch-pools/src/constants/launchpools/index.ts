import { ChainId } from '@pancakeswap/chains'
import { SerializedPool } from '@pancakeswap/pools'
import { SupportedChainId } from '../supportedChains'
import { launchPools as bscLaunchPools } from './bsc'

export type VaultsConfigByChain = {
  [chainId in SupportedChainId]: SerializedPool[]
}

export const LAUNCH_POOL_CONFIG_BY_CHAIN = {
  [ChainId.BSC]: bscLaunchPools,
}
