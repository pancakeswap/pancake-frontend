import { ChainId } from '@pancakeswap/sdk'

import { PCSDuoTokenVaultConfig, VaultConfig } from '../../types'
import { SupportedChainId } from '../supportedChains'
import { vaults as ethVaults } from './1'
import { MANAGER } from '../managers'

export type VaultsConfigByChain = {
  [chainId in SupportedChainId]: VaultConfig[]
}

export const VAULTS_CONFIG_BY_CHAIN = {
  [ChainId.ETHEREUM]: ethVaults,
}

export function isPCSVaultConfig(config: VaultConfig): config is PCSDuoTokenVaultConfig {
  return config.manager === MANAGER.PCS
}
