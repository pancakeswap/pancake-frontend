import { ChainId } from '@pancakeswap/sdk'

export const V3_MIGRATION_SUPPORTED_CHAINS = [ChainId.BSC, ChainId.ETHEREUM]

export function isV3MigrationSupported(chainId: ChainId) {
  return V3_MIGRATION_SUPPORTED_CHAINS.includes(chainId)
}
