import { ChainId } from '@pancakeswap/chains'
import { VaultConfig } from '../../types'
import { SupportedChainId } from '../supportedChains'
import { launchPools as bscLaunchPools } from './bsc'

export type VaultsConfigByChain = {
  [chainId in SupportedChainId]: VaultConfig[]
}

export const LAUNCH_POOL_CONFIG_BY_CHAIN = {
  [ChainId.BSC]: bscLaunchPools,
}
