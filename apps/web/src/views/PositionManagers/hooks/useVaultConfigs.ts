import { VAULTS_CONFIG_BY_CHAIN, VaultConfig } from '@pancakeswap/position-managers'
import { useMemo } from 'react'

import { useActiveChainId } from 'hooks/useActiveChainId'

export function useVaultConfigs(): VaultConfig[] {
  const { chainId } = useActiveChainId()

  return useMemo(() => VAULTS_CONFIG_BY_CHAIN[chainId] || [], [chainId])
}
