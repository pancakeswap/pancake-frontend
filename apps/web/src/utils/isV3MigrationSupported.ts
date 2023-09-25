import { ChainId } from '@pancakeswap/chains'

export const V3_MIGRATION_SUPPORTED_CHAINS = [ChainId.BSC, ChainId.ETHEREUM]

export function isV3MigrationSupported(chainId: ChainId | undefined) {
  if (!chainId) {
    return []
  }

  return V3_MIGRATION_SUPPORTED_CHAINS.includes(chainId)
}
