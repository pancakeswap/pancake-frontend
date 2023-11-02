import { baseManagers } from '../constants/managers'
import { OnChainActionResponse, PCSDuoTokenVaultConfig, PCSPositionManager } from '../types'

interface Params {
  vaultConfig: PCSDuoTokenVaultConfig
}

export function createPCSVaultManager({ vaultConfig }: Params): PCSPositionManager {
  async function addLiquidity(): Promise<OnChainActionResponse> {
    return { txHash: '0x' }
  }

  async function removeLiquidity(): Promise<OnChainActionResponse> {
    return { txHash: '0x' }
  }

  return {
    ...baseManagers[vaultConfig.manager],
    addLiquidity,
    removeLiquidity,

    getTotalAssets: async () => {
      return {
        position: null,
        amounts: [],
      }
    },

    getAccountShare: async () => {
      return null
    },

    getRebalanceHistory: async () => {
      return []
    },

    getOnChainActionAgent: () => {
      return '0x'
    },
  }
}
