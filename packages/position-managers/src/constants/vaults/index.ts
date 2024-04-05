import { ChainId } from '@pancakeswap/chains'
import { PCSDuoTokenVaultConfig, VaultConfig } from '../../types'
import { MANAGER } from '../managers'
import { SupportedChainId } from '../supportedChains'
import { vaults as arbVaults } from './arb'
import { vaults as baseVaults } from './base'
import { vaults as bscVaults } from './bsc'
import { vaults as ethVaults } from './eth'
import { vaults as zkevmVault } from './zkevm'
import { vaults as zksyncVault } from './zksync'

export type VaultsConfigByChain = {
  [chainId in SupportedChainId]: VaultConfig[]
}

export const VAULTS_CONFIG_BY_CHAIN = {
  [ChainId.ETHEREUM]: ethVaults,
  [ChainId.BSC]: bscVaults,
  [ChainId.ARBITRUM_ONE]: arbVaults,
  [ChainId.BASE]: baseVaults,
  [ChainId.ZKSYNC]: zksyncVault,
  [ChainId.POLYGON_ZKEVM]: zkevmVault,
}

export const PM_V2_SS_BOOSTER_SUPPORT_CHAINS = [ChainId.BSC]

export function isPCSVaultConfig(config: VaultConfig): config is PCSDuoTokenVaultConfig {
  return config.manager === MANAGER.PCS
}

export function isThirdPartyVaultConfig(config: VaultConfig): config is PCSDuoTokenVaultConfig {
  return (
    config.manager === MANAGER.BRIL ||
    config.manager === MANAGER.RANGE ||
    config.manager === MANAGER.DEFIEDGE ||
    config.manager === MANAGER.ALPACA
  )
}
