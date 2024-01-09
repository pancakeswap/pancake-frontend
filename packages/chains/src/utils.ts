import { ChainId, testnetChainIds } from './chainId'
import { chainNameToChainId, chainNames, defiLlamaChainNames } from './chainNames'

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

export function isTestnetChainId(chainId: ChainId) {
  return testnetChainIds.includes(chainId)
}
