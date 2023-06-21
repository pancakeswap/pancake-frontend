import { PCSDuoTokenVault, PCSDuoTokenVaultConfig, createPCSVaultManager } from '@pancakeswap/position-managers'
import { useMemo } from 'react'

interface Params {
  config: PCSDuoTokenVaultConfig
}

interface VaultDetail {
  vault: PCSDuoTokenVault
  loading: boolean
  error?: Error | null
}

export function usePCSVault({ config }: Params): VaultDetail {
  const { id } = config
  const manager = useMemo(() => createPCSVaultManager({ vaultConfig: config }), [config])

  const vault = useMemo(() => {
    return {
      ...config,
      manager,
    }
  }, [config, manager])

  return {
    vault,
    loading: false,
    error: null,
  }
}
