import { ChainId } from './chainId'
import { chainNames, defiLlamaChainNames, chainNameToChainId } from './chainNames'

export function getChainName(chainId: ChainId) {
  return chainNames[chainId]
}

export function getLlamaChainName(chainId: ChainId) {
  return defiLlamaChainNames[chainId]
}

export function getChainIdByChainName(chainName?: string): ChainId | undefined {
  if (!chainName) return undefined
  return chainNameToChainId[chainName] ?? undefined
}
