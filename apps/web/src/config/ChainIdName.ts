import { ChainId } from '@pancakeswap/sdk'

export const ChainIdName = {
  [ChainId.ETHEREUM]: 'eth',
  [ChainId.GOERLI]: 'goerli',
  [ChainId.BSC]: 'bsc',
  [ChainId.BSC_TESTNET]: 'bscTestnet',
}

export const getChainId = (chainName: string) => {
  if (!chainName) return undefined
  const parsedQueryChain = Object.entries(ChainIdName).find(([_, value]) => value === chainName)
  return Number(parsedQueryChain?.[0])
}
